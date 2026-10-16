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

  // WebGL2 probe off the main thread (OffscreenCanvas in a Worker): on software
  // rasterisers (SwiftShader) context creation alone can block for >1s. Cached per session.
  const { gl2, renderer } = await probe(forced);
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

const PROBE_SRC = `onmessage=function(e){var r={gl2:false,renderer:''};try{var c=new OffscreenCanvas(1,1);var gl=c.getContext('webgl2',{failIfMajorPerformanceCaveat:!e.data});if(gl){r.gl2=true;var x=gl.getExtension('WEBGL_debug_renderer_info');r.renderer=String(x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));var l=gl.getExtension('WEBGL_lose_context');l&&l.loseContext();}}catch(err){}postMessage(r);};`;

async function probe(forced: boolean): Promise<{ gl2: boolean; renderer: string }> {
  const key = 'fz-gl-probe-' + (forced ? 'f' : 'a');
  try { const c = sessionStorage.getItem(key); if (c) return JSON.parse(c); } catch { /* private mode */ }
  let r: { gl2: boolean; renderer: string } | null = null;
  if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
    r = await new Promise((res) => {
      let url = '';
      try {
        url = URL.createObjectURL(new Blob([PROBE_SRC], { type: 'text/javascript' }));
        const w = new Worker(url);
        const done = (v: any) => { clearTimeout(to); w.terminate(); URL.revokeObjectURL(url); res(v); };
        const to = setTimeout(() => done({ gl2: false, renderer: 'probe-timeout' }), 4000);
        w.onmessage = (e) => done(e.data);
        w.onerror = () => done(null);
        w.postMessage(forced);
      } catch { res(null); }
    });
  }
  if (!r) {
    // fallback: no Worker/OffscreenCanvas (or the worker failed) → probe on the main thread
    r = { gl2: false, renderer: '' };
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: !forced }) as WebGL2RenderingContext | null;
      if (gl) {
        r.gl2 = true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        r.renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch { /* no webgl2 */ }
  }
  try { sessionStorage.setItem(key, JSON.stringify(r)); } catch { /* ignore */ }
  return r;
}
