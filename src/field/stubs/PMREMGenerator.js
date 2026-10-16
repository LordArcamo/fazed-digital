// Build-time stub for three/src/renderers/common/extras/PMREMGenerator.js. The dot field
// uses no environment maps, so PMREM pre-filtering is never invoked (8KB min saved).
export default class PMREMGenerator {
  constructor() { this.pmremVersion = -1; }
  fromScene() { return null; }
  fromEquirectangular() { return null; }
  fromCubemap() { return null; }
  compileCubemapShader() {}
  compileEquirectangularShader() {}
  dispose() {}
}
