// Build-time stub for three/src/renderers/common/XRManager.js. The dot field never
// presents WebXR; this keeps ~19KB (min) of XR session code out of the GL chunk.
// Only the members three's Renderer/pipelines touch outside an XR session are kept.
import { EventDispatcher } from 'three/src/core/EventDispatcher.js';

export default class XRManager extends EventDispatcher {
  constructor() {
    super();
    this.enabled = false;
    this.isPresenting = false;
    this.cameraAutoUpdate = true;
  }
  getEnvironmentBlendMode() { return undefined; }
  getSession() { return null; }
  getFrame() { return null; }
  getCamera() { return null; }
  useMultiview() { return false; }
  renderLayers() {}
  updateCamera() {}
  dispose() {}
}
