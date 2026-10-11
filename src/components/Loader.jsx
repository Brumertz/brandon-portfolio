import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html>
      <span className="canvas-loader"></span>
      <p
        style={{
          color: "#f1f1f1",
          fontSize: "14px",
          fontWeight: "800",
        }}
      >
        {progress.toFixed(0)}%
      </p>
    </Html>
  );
};

export default Loader;
