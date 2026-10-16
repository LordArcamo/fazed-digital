// The one persistent dot field. three/webgpu WebGPURenderer (WebGPU, or its WebGL2 backend).
import {
  BufferAttribute, BufferGeometry, ColorManagement, InstancedBufferAttribute, LineBasicNodeMaterial,
  LineSegments, LinearSRGBColorSpace, PerspectiveCamera, Scene, Sprite, WebGPURenderer,
} from 'three/webgpu';
import {
  Fn, attribute, float, instanceIndex, instancedArray, instancedBufferAttribute, max, vec2,
} from 'three/tsl';
import type { Backend } from '../boot/gpu';
import type { TierSpec } from './tiers';
import type { Formation } from './formations';
import { analyticPush, basePosition, buildMaterial, makeUniforms, type Sources, type Uniforms } from './points.tsl';

ColorManagement.enabled = false; // blend in sRGB numbers, like CSS → poster parity

export interface FieldTimings { init: number; compile: number; firstFrame: number }
export interface Field {
  backend: Backend;
  spec: TierSpec;
  u: Uniforms;
  n: number;
  timings: FieldTimings;
  canvas: HTMLCanvasElement;
  /** Start a morph from the current on-screen state to `f`. Sets uMorph = 0. */
  target(f: Formation, opts?: { anchor?: [number, number]; radial?: number }): void;
  /** Replace the target in place (same morph progress), e.g. on resize or scroll-rig updates. */
  retarget(f: Formation): void;
  /** Snap (no morph) to a formation. */
  set(f: Formation): void;
  current(): Formation | null;
  cursor(x: number, y: number, active: boolean): void;
  ripple(x: number, y: number, amp?: number): void;
  setLinks(on: boolean): void;
  tick(dt: number, t: number): void;
  render(): void;
  resize(w: number, h: number): void;
  setSpec(s: TierSpec): void;
  dispose(): void;
}

export async function createField(canvas: HTMLCanvasElement, backend: Backend, spec: TierSpec): Promise<Field> {
  const t0 = performance.now();
  const renderer = new WebGPURenderer({
    canvas, antialias: false, alpha: false, forceWebGL: backend !== 'webgpu', powerPreference: 'high-performance',
  });
  await renderer.init();
  const realBackend: Backend = (renderer.backend as any).isWebGPUBackend ? 'webgpu' : 'webgl2';
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x090909, 1);
  let w = innerWidth, h = innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, spec.dpr));
  renderer.setSize(w, h, false);
  const tInit = performance.now() - t0;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, w / h, 10, 20000);
  const placeCamera = () => {
    camera.aspect = w / h;
    camera.position.set(0, 0, h / 2 / Math.tan((15 * Math.PI) / 180));
    camera.near = camera.position.z * 0.25;
    camera.far = camera.position.z * 4;
    camera.updateProjectionMatrix();
  };
  placeCamera();

  const n = spec.points;
  const u = makeUniforms();
  u.uHalf.value.set(w / 2, h / 2);

  // CPU mirrors of the GPU buffers
  const A = new Float32Array(n * 4), B = new Float32Array(n * 4), M = new Float32Array(n * 4);
  const useCompute = spec.compute && realBackend === 'webgpu';

  let S: Sources;
  let attrs: { A: any; B: any; M: any };
  let computeNode: any = null;
  let offsets: any = null;
  if (realBackend === 'webgpu') {
    const sA = instancedArray(A, 'vec4'), sB = instancedArray(B, 'vec4'), sM = instancedArray(M, 'vec4');
    attrs = { A: sA.value, B: sB.value, M: sM.value };
    S = { A: sA.toAttribute(), B: sB.toAttribute(), M: sM.toAttribute() };
    if (useCompute) {
      offsets = instancedArray(n, 'vec2');
      const vel = instancedArray(n, 'vec2');
      const uDt = u.uTime; // reuse clock; dt passed via a dedicated uniform below
      void uDt;
      const SC: Sources = { A: sA.element(instanceIndex), B: sB.element(instanceIndex), M: sM.element(instanceIndex) };
      computeNode = Fn(() => {
        const { xy } = basePosition(u, SC);
        const tgt = analyticPush(u, xy);
        const o = offsets.element(instanceIndex);
        const v = vel.element(instanceIndex);
        // spring (k 12 ≈ ω 12 rad/s at 60fps) with 0.86 damping per frame → overshoot + settle
        v.assign(v.add(tgt.sub(o).mul(float(144 / 3600))).mul(0.86));
        o.assign(o.add(v));
      })().compute(n);
      S.offset = offsets.toAttribute();
    }
  } else {
    const iA = new InstancedBufferAttribute(A, 4), iB = new InstancedBufferAttribute(B, 4), iM = new InstancedBufferAttribute(M, 4);
    attrs = { A: iA, B: iB, M: iM };
    S = { A: instancedBufferAttribute(iA), B: instancedBufferAttribute(iB), M: instancedBufferAttribute(iM) };
  }

  const pointsMat = buildMaterial(u, S, { ripple: spec.ripple });
  const points = new Sprite(pointsMat);
  points.count = n;
  points.frustumCulled = false;
  scene.add(points);

  let halo: Sprite | null = null;
  const haloMat = buildMaterial(u, S, { ripple: spec.ripple, halo: true });
  halo = new Sprite(haloMat);
  halo.count = n;
  halo.frustumCulled = false;
  halo.visible = spec.halo;
  scene.add(halo);

  // cursor links: 12 hairlines from the cursor node to the nearest pushed points
  const LINKS = 12;
  const linkPos = new Float32Array(LINKS * 2 * 3);
  const linkA = new Float32Array(LINKS * 2);
  const linkGeo = new BufferGeometry();
  linkGeo.setAttribute('position', new BufferAttribute(linkPos, 3));
  linkGeo.setAttribute('aAlpha', new BufferAttribute(linkA, 1));
  const linkMat = new LineBasicNodeMaterial({ transparent: true, depthTest: false, depthWrite: false });
  linkMat.color.setRGB(201 / 255, 1, 87 / 255);
  linkMat.opacityNode = attribute('aAlpha', 'float').mul(0.5);
  const links = new LineSegments(linkGeo, linkMat);
  links.frustumCulled = false;
  links.renderOrder = 2;
  scene.add(links);
  let linksOn = true;

  let cur: Formation | null = null;
  let tgt: Formation | null = null;
  let cursorActive = false;
  let ripIdx = 0;

  const upload = () => {
    for (const k of ['A', 'B', 'M'] as const) attrs[k].needsUpdate = true;
  };

  // CPU copy of the shader's m_i
  const mOf = (i: number) => {
    const x = Math.min(1, Math.max(0, (u.uMorph.value - M[i * 4 + 1] * 0.25) / 0.75));
    return x * x * (3 - 2 * x);
  };

  /** Snapshot what is on screen (without noise) into A. */
  const snapshot = () => {
    for (let i = 0; i < n; i++) {
      const m = mOf(i), o = i * 4;
      for (let c = 0; c < 4; c++) {
        // layer is discrete: take whichever side dominates
        A[o + c] = c === 2 ? (m < 0.5 ? A[o + 2] : B[o + 2]) : A[o + c] + (B[o + c] - A[o + c]) * m;
      }
      const a = M[o + 2] + (M[o + 3] - M[o + 2]) * m;
      M[o + 2] = a;
    }
    u.uSizeA.value = u.uSizeA.value + (u.uSizeB.value - u.uSizeA.value) * Math.min(1, u.uMorph.value);
  };

  const writeB = (f: Formation, anchor = f.anchor, radial = 0.75) => {
    B.set(f.data.subarray(0, n * 4));
    let maxD = 1;
    for (let i = 0; i < n; i++) {
      const dx = B[i * 4] - anchor[0], dy = B[i * 4 + 1] - anchor[1];
      maxD = Math.max(maxD, dx * dx + dy * dy);
    }
    maxD = Math.sqrt(maxD);
    let s = 1234567;
    for (let i = 0; i < n; i++) {
      s = (s * 16807) % 2147483647;
      const seed = s / 2147483647;
      const dx = B[i * 4] - anchor[0], dy = B[i * 4 + 1] - anchor[1];
      const o = i * 4;
      M[o] = seed;
      M[o + 1] = Math.min(1, (Math.sqrt(dx * dx + dy * dy) / maxD) * radial + seed * (1 - radial));
      M[o + 3] = f.alpha[i];
    }
    u.uSizeB.value = f.size;
  };

  const field: Field = {
    backend: realBackend,
    spec,
    u,
    n,
    canvas,
    timings: { init: tInit, compile: 0, firstFrame: 0 },
    target(f, opts = {}) {
      if (cur || tgt) snapshot();
      writeB(f, opts.anchor, opts.radial);
      u.uMorph.value = 0;
      cur = tgt ?? cur;
      tgt = f;
      upload();
    },
    retarget(f) {
      B.set(f.data.subarray(0, n * 4));
      for (let i = 0; i < n; i++) M[i * 4 + 3] = f.alpha[i];
      u.uSizeB.value = f.size;
      tgt = f;
      attrs.B.needsUpdate = true;
      attrs.M.needsUpdate = true;
    },
    set(f) {
      writeB(f);
      A.set(B);
      for (let i = 0; i < n; i++) M[i * 4 + 2] = M[i * 4 + 3];
      u.uSizeA.value = u.uSizeB.value = f.size;
      u.uMorph.value = 1;
      cur = tgt = f;
      upload();
    },
    current: () => tgt,
    cursor(x, y, active) {
      cursorActive = active;
      u.uCursor.value.set(active ? x : -9999, active ? y : -9999);
    },
    ripple(x, y, amp = 1) {
      if (!spec.ripple) return;
      u.uRipples.array[ripIdx % 3].set(x, y, u.uTime.value, amp);
      ripIdx++;
    },
    setLinks(on) { linksOn = on; },
    tick(_dt, t) {
      u.uTime.value = t;
      if (computeNode) renderer.compute(computeNode);
      updateLinks();
      renderer.render(scene, camera);
    },
    render() { renderer.render(scene, camera); },
    resize(nw, nh) {
      w = nw; h = nh;
      renderer.setSize(w, h, false);
      u.uHalf.value.set(w / 2, h / 2);
      placeCamera();
    },
    setSpec(s) {
      field.spec = s;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, s.dpr));
      renderer.setSize(w, h, false);
      points.count = Math.min(n, s.points);
      if (halo) { halo.count = points.count; halo.visible = s.halo; }
    },
    dispose() {
      linkGeo.dispose(); linkMat.dispose(); pointsMat.dispose(); haloMat.dispose();
      renderer.dispose();
    },
  };

  // nearest-12 search over the visible prefix of the current/target formation
  const best = new Float32Array(LINKS * 3);
  function updateLinks() {
    linkA.fill(0);
    if (!linksOn || !cursorActive || !tgt) { (linkGeo.attributes.aAlpha as BufferAttribute).needsUpdate = true; return; }
    const cx = u.uCursor.value.x, cy = u.uCursor.value.y, R = u.uPushR.value, R2 = R * R;
    best.fill(1e9);
    const lim = Math.min(n, Math.max(tgt.visible, cur?.visible ?? 0));
    const stride = field.spec.densify > 1 && tgt.id.startsWith('shot') ? field.spec.densify : 1;
    for (let i = 0; i < lim; i += stride) {
      const m = mOf(i), o = i * 4;
      const al = M[o + 2] + (M[o + 3] - M[o + 2]) * m;
      if (al <= 0.05) continue;
      const x = A[o] + (B[o] - A[o]) * m, y = A[o + 1] + (B[o + 1] - A[o + 1]) * m + (m > 0.5 ? (B[o + 2] > 0.5 ? u.uFocusY.value : 0) : (A[o + 2] > 0.5 ? u.uFocusY.value : 0));
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
      if (d2 > R2 || d2 >= best[(LINKS - 1) * 3]) continue;
      let k = LINKS - 1;
      while (k > 0 && best[(k - 1) * 3] > d2) { best.copyWithin(k * 3, (k - 1) * 3, k * 3); k--; }
      best[k * 3] = d2; best[k * 3 + 1] = x; best[k * 3 + 2] = y;
    }
    const hx = u.uHalf.value.x, hy = u.uHalf.value.y, P = u.uPush.value;
    for (let k = 0; k < LINKS; k++) {
      const d2 = best[k * 3];
      if (d2 > R2) continue;
      const d = Math.max(Math.sqrt(d2), 0.001);
      let x = best[k * 3 + 1], y = best[k * 3 + 2];
      const f = P * Math.pow(Math.max(1 - d / R, 0), 2);
      x += ((x - cx) / d) * f; y += ((y - cy) / d) * f;
      linkPos.set([cx - hx, hy - cy, 0, x - hx, hy - y, 0], k * 6);
      const a = 1 - d / R;
      linkA[k * 2] = a; linkA[k * 2 + 1] = a * 0.6;
    }
    (linkGeo.attributes.position as BufferAttribute).needsUpdate = true;
    (linkGeo.attributes.aAlpha as BufferAttribute).needsUpdate = true;
  }

  // pre-compile pipelines before anything is shown
  const tc = performance.now();
  await renderer.compileAsync(scene, camera);
  if (computeNode) await (renderer as any).computeAsync?.(computeNode);
  field.timings.compile = performance.now() - tc;
  void max; void vec2;
  return field;
}
