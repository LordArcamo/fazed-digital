// Build-time replacement for three's BasicNodeLibrary. The dot field renders unlit node
// materials with NoToneMapping, so the light classes, light nodes and tone-mapping functions
// the stock library registers are never looked up.
import NodeLibrary from 'three/src/renderers/common/nodes/NodeLibrary.js';
export default class SlimNodeLibrary extends NodeLibrary {}
