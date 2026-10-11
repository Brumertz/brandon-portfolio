import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Warms a scene up without ever blocking the main thread.
 *
 * This replaces drei's `<Preload all />`, which runs two things inside a
 * `useLayoutEffect` — that is, synchronously inside React's commit:
 *
 *     gl.compile(scene, camera)       // create + link every program
 *     cubeCamera.update(gl, scene)    // render the scene 6 more times, then
 *                                     // throw the cube render target away
 *
 * The cube render is what costs. The first `renderer.render()` reads every
 * program's uniforms, running `WebGLProgram.onFirstUse`, whose first statement
 * is `gl.getProgramParameter(program, LINK_STATUS)` — a query that blocks until
 * ANGLE has finished linking. That discards `KHR_parallel_shader_compile` and
 * serialises every link into one synchronous task, dominating the main thread.
 *
 * `gl.compileAsync()` starts exactly the same links and then polls the
 * `COMPLETION_STATUS_KHR` query instead — one the WebGL spec guarantees is
 * non-blocking — every 10 ms. Nothing on the main thread ever waits, and when
 * the first render does arrive its `onFirstUse` finds the links already
 * finished and costs a few milliseconds.
 *
 * Pair it with `frameloop={warmed ? "always" : "never"}` so no frame draws
 * until the warm-up resolves: the first paint is then the finished scene
 * behind its CSS fade instead of a stall.
 *
 * `finish` is idempotent and time-boxed, so a driver that never reports
 * COMPLETION_STATUS still gets a scene — worst case, today's behaviour.
 */
const WarmUp = ({ onReady }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    let settled = false;
    let alive = true;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (alive) onReadyRef.current();
    };

    const safety = setTimeout(finish, 4000);
    Promise.resolve(gl.compileAsync(scene, camera)).then(finish, finish);

    return () => {
      alive = false;
      clearTimeout(safety);
    };
  }, [gl, scene, camera]);

  return null;
};

export default WarmUp;
