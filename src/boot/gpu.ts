// GPU gate (§4.5). The SSR poster is the default, so a "t0" result simply means "stay".
import type { Flags } from './flags';

export type Tier = 't0' | 't1' | 't2' | 't3';
export type Backend = 'webgpu' | 'webgl2';
export interface Gate { tier: Tier; backend: Backend | null; renderer: string; reason: string }

export const SOFTWARE_RE =
  /SwiftShader|llvmpipe|softpipe|Basic Render|Microsoft Basic|software|Mesa OffScreen|ANGLE \(.*SwiftShader/i;

const t0 = (reason: string, renderer = ''): Gate => ({ tier: 't0', backend: null, renderer, reason });

export async function gate(flags: Flags): Promise<Gate> {
  if (flags.gl === 'off') return t0('flag:off');
  const nav = navigator as any;
  const forced = flags.gl === 'force' || !!flags.record;
  if (!forced && nav.connection?.saveData) return t0('save-data');

  let gl2 = false;
  let renderer = '';
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: !forced }) as WebGL2RenderingContext | null;
    if (gl) {
      gl2 = true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch { /* no webgl2 */ }

  if (!forced) {
    if (!gl2) return t0('no-webgl2');
    if (SOFTWARE_RE.test(renderer)) return t0('software', renderer);
  }

  let backend: Backend | null = gl2 ? 'webgl2' : null;
  if (nav.gpu) {
    try {
      const ad = await nav.gpu.requestAdapter({ powerPreference: 'high-performance' });
      const fallback = ad?.info?.isFallbackAdapter ?? ad?.isFallbackAdapter;
      if (ad && !fallback) backend = 'webgpu';
    } catch { /* keep webgl2 */ }
  }
  if (!backend) return t0('no-backend', renderer);

  if (flags.record) return { tier: 't1', backend, renderer, reason: 'record' };
  const hc = navigator.hardwareConcurrency || 4;
  const dm = nav.deviceMemory ?? 8;
  const mobile = matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  let tier: Tier = 't2';
  if (dm < 4 || hc < 4) tier = 't3';
  else if (!mobile && hc >= 8 && innerWidth >= 1024) tier = 't1';
  return { tier, backend, renderer, reason: 'ok' };
}
