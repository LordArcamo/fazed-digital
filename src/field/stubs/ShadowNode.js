// Build-time stub for three/src/nodes/lighting/ShadowNode.js. The dot field uses no lights,
// so shadow maps are never built (8KB min saved). PointShadowNode extends this class.
import Node from 'three/src/nodes/core/Node.js';
export default class ShadowNode extends Node {
  constructor() { super('float'); }
}
export const shadow = () => { throw new Error('three-slim: shadows are not included in the dot-field build'); };
