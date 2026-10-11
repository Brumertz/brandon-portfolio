import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { configureRenderer } from "./rendererConfig";
import WarmUp from "./WarmUp";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const [warmed, setWarmed] = useState(false);

  return (
    <Canvas
      shadows
      frameloop={warmed ? "always" : "never"}
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => configureRenderer(gl)}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.5}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
        <WarmUp onReady={() => setWarmed(true)} />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;

