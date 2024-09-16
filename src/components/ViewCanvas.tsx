"use client";

import { Canvas } from "@react-three/fiber";

import { SodaCan } from "@/components/SodaCan";
import { Environment } from "@react-three/drei";

type ViewCanvasProps = {};

export default function ViewCanvas({}: ViewCanvasProps) {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 30,
      }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{
        fov: 30,
      }}
    >
      <SodaCan />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </Canvas>
  );
}
