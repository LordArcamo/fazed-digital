// Vite plugin that slims three/webgpu for the dot field (measured in the T0 spike):
//  1. three/webgpu → src/field/three-entry.js (only the classes the field uses; the stock
//     entry's `export { TSL }` namespace pins every node module)
//  2. three/tsl → three/src/nodes/TSL.js (named re-exports, tree-shakable)
//  3. three/src/nodes/** modules that don't register chaining methods are marked
//     side-effect-free (three's package.json flags the whole folder as side-effectful)
//  4. XRManager + PMREMGenerator + ShadowNode → stubs (no WebXR, env maps or lights in the field)
import { fileURLToPath } from 'node:url';
const three = fileURLToPath(new URL('../../node_modules/three/src/', import.meta.url));
const entry = fileURLToPath(new URL('./three-entry.js', import.meta.url));
const xrStub = fileURLToPath(new URL('./stubs/XRManager.js', import.meta.url));
const pmremStub = fileURLToPath(new URL('./stubs/PMREMGenerator.js', import.meta.url));
const shadowStub = fileURLToPath(new URL('./stubs/ShadowNode.js', import.meta.url));
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
