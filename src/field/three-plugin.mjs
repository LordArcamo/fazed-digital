// Vite plugin that slims three/webgpu for the dot field (measured in the T0 spike):
//  1. three/webgpu → src/field/three-entry.js (only the classes the field uses; the stock
//     entry's `export { TSL }` namespace pins every node module)
//  2. three/tsl → three/src/nodes/TSL.js (named re-exports, tree-shakable)
//  3. three/src/nodes/** modules that don't register chaining methods are marked
//     side-effect-free (three's package.json flags the whole folder as side-effectful)
//  4. XRManager + PMREMGenerator + ShadowNode + timestamp query pools → stubs (no WebXR, env maps,
//     lights or GPU profiling in the field); BasicNodeLibrary → an empty NodeLibrary (no lights,
//     no tone mapping)
import { fileURLToPath } from 'node:url';
const three = fileURLToPath(new URL('../../node_modules/three/src/', import.meta.url));
const entry = fileURLToPath(new URL('./three-entry.js', import.meta.url));
const xrStub = fileURLToPath(new URL('./stubs/XRManager.js', import.meta.url));
const pmremStub = fileURLToPath(new URL('./stubs/PMREMGenerator.js', import.meta.url));
const shadowStub = fileURLToPath(new URL('./stubs/ShadowNode.js', import.meta.url));
const libStub = fileURLToPath(new URL('./stubs/NodeLibrary.js', import.meta.url));
const tsStub = fileURLToPath(new URL('./stubs/TimestampQueryPool.js', import.meta.url));
export function threeSlim() {
  return {
    name: 'three-slim',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id === 'three/webgpu') return entry;
      if (id === 'three/tsl') return three + 'nodes/TSL.js';
      if (id === './XRManager.js' && importer && importer.includes('/three/src/renderers/common/')) return xrStub;
      if (id.endsWith('/renderers/common/extras/PMREMGenerator.js') && importer && importer.includes('/three/src/nodes/pmrem/')) return pmremStub;
      if ((id === './ShadowNode.js' && importer?.includes('/three/src/nodes/lighting/')) || (id === './lighting/ShadowNode.js' && importer?.includes('/three/src/nodes/'))) return shadowStub;
      if (id === './nodes/BasicNodeLibrary.js' && importer?.includes('/three/src/renderers/webgpu/WebGPURenderer.Nodes.js')) return libStub;
      if (/\/utils\/(WebGPU|WebGL)TimestampQueryPool\.js$/.test(id) && importer && /\/three\/src\/renderers\/(webgpu|webgl-fallback)\//.test(importer)) return tsStub;
      return null;
    },
    transform(code, id) {
      if (id.includes('/three/src/nodes/') && !/addMethodChaining\s*\(|addNodeElement\s*\(/.test(code)) {
        return { code, map: null, moduleSideEffects: false };
      }
      return null;
    },
  };
}
