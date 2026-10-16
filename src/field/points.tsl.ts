// TSL node graph for the dot field (§4.2). Authored once; three compiles it to WGSL
// (WebGPU) or GLSL ES 3 (WebGL2 backend). The vertex stage is stateless: positions are
// mix(A, B, m_i) + curl + cursor push + ripples, so both backends render identically.
import { AdditiveBlending, NormalBlending, PointsNodeMaterial, Vector2, Vector3, Vector4 } from 'three/webgpu';
import {
  Fn, If, Loop, PI, abs, clamp, cos, exp, float, length, max, mix, normalize, select,
  sin, smoothstep, step, uniform, uniformArray, uv, varying, vec2, vec3, vec4,
} from 'three/tsl';

type N = any; // TSL nodes are loosely typed; keep the graph readable

export function makeUniforms() {
  return {
    uMorph: uniform(1),
    uTime: uniform(0),
    uScatter: uniform(0),
    uDepth: uniform(0), // px separation of the mark planes
    uCurl: uniform(4),
    uLitGain: uniform(1),
    uDust: uniform(1),
    uDim: uniform(1),
    uSizeA: uniform(2),
    uSizeB: uniform(2),
    uHalf: uniform(new Vector2(720, 450)),
    uCursor: uniform(new Vector2(-9999, -9999)),
    uPush: uniform(28),
    uPushR: uniform(120),
    uTilt: uniform(new Vector2(0, 0)),
    uTiltC: uniform(new Vector3(0, 0, 0)),
    uFocusY: uniform(0),
    uFocusA: uniform(1), // focus-layer alpha (fades the mark independently of the lattice)
    uRipples: uniformArray([new Vector4(0, 0, -99, 0), new Vector4(0, 0, -99, 0), new Vector4(0, 0, -99, 0)], 'vec4'),
    uBack: uniform(0), // globe: dim the far hemisphere
    uLight: uniform(0), // wordmark: points near the cursor light lime
    uScan: uniform(2), // scan-resolve threshold (0..1 of the target rect, 2 = off)
    uScanRect: uniform(new Vector4(0, 0, 0, 0)),
  };
}
export type Uniforms = ReturnType<typeof makeUniforms>;

export interface Sources { A: N; B: N; M: N; offset?: N }

/**
 * Analytic curl noise: velocity = curl of a 2-octave stream function
 * ψ = sin(k1·x + t)·cos(k2·y − .7t) + .5·sin(k3·x − .6t + 1.7)·cos(k4·y + .9t).
 * Divergence-free (points swirl, they don't bunch), cheap, identical on both backends.
 * z = a third, independent wave for depth shimmer. Output roughly in [-1, 1].
 */
export function curl(p: N, t: N) {
  const k1 = 6.1, k2 = 5.3, k3 = 11.7, k4 = 9.4;
  const a = p.x.mul(k1).add(t), b = p.y.mul(k2).sub(t.mul(0.7));
  const c = p.x.mul(k3).sub(t.mul(0.6)).add(1.7), d = p.y.mul(k4).add(t.mul(0.9));
  const vx = sin(a).mul(sin(b)).mul(-k2).sub(sin(c).mul(sin(d)).mul(0.5 * k4));
  const vy = cos(a).mul(cos(b)).mul(-k1).sub(cos(c).mul(cos(d)).mul(0.5 * k3));
  const vz = sin(p.x.mul(7.3).add(p.y.mul(4.1)).add(t.mul(1.3)));
  return vec3(vx.div(k1 + 0.5 * k3), vy.div(k1 + 0.5 * k3), vz);
}

/** m_i: per-point staggered morph progress. */
export const morphOf = (U: Uniforms, M: N) =>
  smoothstep(0, 1, clamp(U.uMorph.sub(M.y.mul(0.25)).div(0.75), 0, 1));

const planeZ = (layer: N) => select(layer.greaterThan(0.5), layer.sub(2), float(0));

/** Base position (px, top-left origin) without the cursor push. Shared with the compute pass. */
export function basePosition(U: Uniforms, S: Sources) {
  const m = morphOf(U, S.M);
  const xy = mix(S.A.xy, S.B.xy, m).toVar();
  const focus = mix(step(0.5, S.A.z), step(0.5, S.B.z), m);
  const z = mix(planeZ(S.A.z), planeZ(S.B.z), m).mul(U.uDepth).toVar();
  // curl-ish turbulence: grows mid-morph and with scroll velocity
  const amp = U.uCurl.add(sin(m.mul(PI)).mul(22)).add(U.uScatter.mul(30));
  const n = curl(xy.mul(0.004), U.uTime.mul(0.1).add(S.M.x.mul(0.37)));
  xy.addAssign(n.xy.mul(amp));
  z.addAssign(n.z.mul(amp).mul(0.5));
  // focus layer (the hero mark): scroll shift
  xy.y.addAssign(U.uFocusY.mul(focus));
  return { xy, z, focus, m };
}

export function analyticPush(U: Uniforms, xy: N) {
  const d = xy.sub(U.uCursor);
  const dist = max(length(d), 0.001);
  const f = U.uPush.mul(max(float(1).sub(dist.div(U.uPushR)), 0).pow(2));
  return d.div(dist).mul(f);
}

export function buildPositionNode(U: Uniforms, S: Sources, ripple: boolean) {
  return Fn(() => {
    const { xy, z, focus } = basePosition(U, S);
    if (S.offset) xy.addAssign(S.offset);
    else xy.addAssign(analyticPush(U, xy));
    if (ripple) {
      Loop(3, ({ i }: any) => {
        const r = U.uRipples.element(i);
        const age = U.uTime.sub(r.z);
        If(age.greaterThan(0).and(age.lessThan(0.9)), () => {
          const d = xy.sub(r.xy);
          const dist = max(length(d), 0.001);
          const ring = exp(dist.sub(age.mul(900)).div(40).pow(2).negate());
          xy.addAssign(d.div(dist).mul(ring.mul(r.w).mul(14).mul(float(1).sub(age.div(0.9)))));
        });
      });
    }
    // field tilt around the mark centre, weighted by focus (desktop hero only)
    const rel = vec3(xy.sub(U.uTiltC.xy), z).toVar();
    const ay = U.uTilt.x.mul(focus), ax = U.uTilt.y.mul(focus);
    const x1 = rel.x.mul(cos(ay)).add(rel.z.mul(sin(ay)));
    const z1 = rel.z.mul(cos(ay)).sub(rel.x.mul(sin(ay)));
    const y2 = rel.y.mul(cos(ax)).sub(z1.mul(sin(ax)));
    const z2 = z1.mul(cos(ax)).add(rel.y.mul(sin(ax)));
    const px = x1.add(U.uTiltC.x), py = y2.add(U.uTiltC.y);
    // px (top-left origin, y down) → world (centre origin, y up). 1 unit = 1 CSS px at z=0.
    return vec3(px.sub(U.uHalf.x), U.uHalf.y.sub(py), z2);
  })();
}

/** tone: 0 gray-700 → 1 white(.55) → 2 lime(1.0) */
function toneColor(t: N) {
  const gray = vec3(42 / 255, 42 / 255, 42 / 255);
  const white = vec3(245 / 255, 244 / 255, 240 / 255);
  const lime = vec3(201 / 255, 1, 87 / 255);
  const a = clamp(t, 0, 1), b = clamp(t.sub(1), 0, 1);
  const col = mix(mix(gray, white, a), lime, b);
  const alpha = mix(mix(float(1), float(0.55), a), float(1), b);
  return { col, alpha, lit: b };
}

export interface MaterialOpts { halo?: boolean; ripple: boolean }

export function buildMaterial(U: Uniforms, S: Sources, opts: MaterialOpts) {
  const mat = new PointsNodeMaterial({ transparent: true, depthWrite: false, depthTest: false, sizeAttenuation: false });
  mat.blending = opts.halo ? AdditiveBlending : NormalBlending;
  mat.positionNode = buildPositionNode(U, S, opts.ripple);

  const m = morphOf(U, S.M);
  // lit gain: during the intro the lime is gated so frame 1 equals the poster
  const tA = S.A.w, tB = S.B.w;
  const gate = (t: N) => select(t.greaterThan(1), float(1).add(t.sub(1).mul(U.uLitGain)), t);
  const tone0 = mix(gate(tA), gate(tB), m);
  const bxy = mix(S.A.xy, S.B.xy, m);
  const lightK = clamp(float(1).sub(length(bxy.sub(U.uCursor)).div(90)), 0, 1).mul(U.uLight);
  const tone = tone0.add(float(2).sub(tone0).mul(lightK));
  const aMix = mix(S.M.z, S.M.w, m);
  const alphaRaw = select(aMix.lessThan(0), aMix.negate().mul(U.uDust), aMix);
  const focus = mix(step(0.5, S.A.z), step(0.5, S.B.z), m);
  const { col, alpha, lit } = toneColor(tone);
  const dimmed = mix(U.uDim, U.uFocusA, focus);
  // far hemisphere of the globe: z after the same rotY the position node applies
  const zf = mix(planeZ(S.A.z), planeZ(S.B.z), m);
  const relx = bxy.x.sub(U.uTiltC.x).div(max(U.uDepth, 1));
  const ay = U.uTilt.x.mul(focus);
  const zr = zf.mul(cos(ay)).sub(relx.mul(sin(ay)));
  const back = mix(float(1), smoothstep(-0.45, 0.2, zr).mul(0.82).add(0.18), U.uBack.mul(focus));
  const a = alphaRaw.mul(alpha).mul(dimmed).mul(back);
  const size = mix(U.uSizeA, U.uSizeB, m).mul(float(1).add(lit.mul(0.35)));

  const vCol = varying(col);
  const vA = varying(opts.halo ? a.mul(lit).mul(0.12) : a);
  const vSize = varying(opts.halo ? size.mul(3.2) : size);
  const visible = opts.halo ? lit.mul(alphaRaw).greaterThan(0.02) : a.greaterThan(0.002);
  // quad = diameter + 2px AA margin; collapse invisible points so they cost no fragments
  mat.sizeNode = select(visible, (opts.halo ? size.mul(3.2) : size).add(2), float(0));

  mat.colorNode = vCol;
  mat.opacityNode = Fn(() => {
    const quad = vSize.add(2);
    const d = length(uv().sub(0.5)).mul(quad);
    const r = vSize.mul(0.5);
    const disc = opts.halo ? smoothstep(r, 0, d).pow(1.6) : clamp(r.sub(d).add(0.5), 0, 1);
    return disc.mul(vA);
  })();
  return mat;
}

export { vec2, vec4, abs, normalize };
