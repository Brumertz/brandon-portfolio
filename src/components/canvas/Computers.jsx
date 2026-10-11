import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";
import { configureRenderer } from "./rendererConfig";
import WarmUp from "./WarmUp";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  const groupRef = useRef();

  useEffect(() => {
    computer.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.color.set("#c8c8d0");
          mat.metalness = 0.3;
          mat.roughness = 0.55;
        });
      }
    });
  }, [computer.scene]);

  const firstFrame = useRef(true);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    // Runs before this frame's gl.render(), so the browser paints the fully
    // drawn scene while the CSS fade (styles.css) is starting — the desk
    // arrives over 600 ms instead of cutting in.
    if (firstFrame.current) {
      firstFrame.current = false;
      state.gl.domElement.classList.add("is-live");
    }
  });

  return (
    <group ref={groupRef}>
      <hemisphereLight intensity={3.5} groundColor={new THREE.Color("black")} />
      <spotLight
        intensity={7}
        angle={0.3}
        penumbra={1}
        position={[10, 10, 10]}
        castShadow={false}
        shadow-mapSize={1024}
      />
      <pointLight intensity={3} position={[-5, 5, -5]} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.45 : 0.75}
        position={isMobile ? [0, -2.25, -1.5] : [0, -3.25, -1.5]}
        rotation={[-0.01, -Math.PI / 2, -0.04]}
        castShadow={false}
      />
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [warmed, setWarmed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop={warmed ? "always" : "never"}
      shadows={false}
      dpr={[1, 2]}
      camera={{ position: [0, 3, 14], fov: 30 }}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => configureRenderer(gl)}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
        <WarmUp onReady={() => setWarmed(true)} />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload("./desktop_pc/scene.gltf");

export default ComputersCanvas;

