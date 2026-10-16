// Build-time stub for the WebGPU/WebGL timestamp query pools. They are only created when the
// renderer runs with `trackTimestamp: true` (GPU profiling), which the dot field never does.
export default class TimestampQueryPool {
  constructor() { throw new Error('three-slim: timestamp queries are not included in the dot-field build'); }
}
