/**
 * One-time `<Canvas>` renderer configuration, shared by every WebGL surface.
 *
 * `WebGLRenderer.debug.checkShaderErrors` ships as `true`, and the check runs
 * on the *first use* of every program — `WebGLProgram.onFirstUse`:
 *
 *     gl.getProgramInfoLog(program)
 *     gl.getShaderInfoLog(vertexShader)
 *     gl.getShaderInfoLog(fragmentShader)
 *     gl.getProgramParameter(program, LINK_STATUS)   <-- blocks here
 *     new WebGLUniforms(gl, program)
 *     fetchAttributeLocations(gl, program)
 *
 * The LINK_STATUS query waits for the driver to finish linking, so it throws
 * away `KHR_parallel_shader_compile` and serialises every program in the scene
 * into one synchronous task instead of letting them link in parallel. On the
 * hero's first render that check alone accounted for **391 of the 706 ms** of
 * the long task that makes up almost the entire Lighthouse TBT budget.
 *
 * Only diagnostics are lost: a shader fault is still caught by
 * `BallErrorBoundary`, and `npm run verify` (build + smoke test) + Lighthouse
 * assert that every canvas actually paints.
 */
export function configureRenderer(gl) {
  gl.debug.checkShaderErrors = false;
}
