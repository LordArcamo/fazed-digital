// Minimal three/webgpu entry for the dot field: only what src/field/* imports.
// The stock entry re-exports the whole TSL namespace (`export { TSL }`), which pins
// every node module in the bundle. Aliased to `three/webgpu` by three-plugin.mjs.
export { default as WebGPURenderer } from 'three/src/renderers/webgpu/WebGPURenderer.Nodes.js';
export { default as PointsNodeMaterial } from 'three/src/materials/nodes/PointsNodeMaterial.js';
export { default as LineBasicNodeMaterial } from 'three/src/materials/nodes/LineBasicNodeMaterial.js';
export { default as MeshBasicNodeMaterial } from 'three/src/materials/nodes/MeshBasicNodeMaterial.js';
export { default as StorageInstancedBufferAttribute } from 'three/src/renderers/common/StorageInstancedBufferAttribute.js';
export { Sprite } from 'three/src/objects/Sprite.js';
export { Mesh } from 'three/src/objects/Mesh.js';
export { LineSegments } from 'three/src/objects/LineSegments.js';
export { Scene } from 'three/src/scenes/Scene.js';
export { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
export { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export { BufferAttribute } from 'three/src/core/BufferAttribute.js';
export { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute.js';
export { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
export { Vector2 } from 'three/src/math/Vector2.js';
export { Vector3 } from 'three/src/math/Vector3.js';
export { Vector4 } from 'three/src/math/Vector4.js';
export { Color } from 'three/src/math/Color.js';
export { ColorManagement } from 'three/src/math/ColorManagement.js';
export { AdditiveBlending, NormalBlending, LinearSRGBColorSpace } from 'three/src/constants.js';
