// components/StonicModel.jsx
"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

function StonicOBJ({ variant }) {
  // Load OBJ alone (no MTL)
  const object = useLoader(OBJLoader, "/models/stonic.obj");

  // Process, add materials, shadows, scale, rotation
  const processed = useMemo(() => {
    const root = object;

    root.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        // Give a nice material since we don’t have MTL
        obj.material = new THREE.MeshStandardMaterial({
          color: "#22c55e", // neon green aesthetic
          metalness: 0.35,
          roughness: 0.4,
        });
      }
    });

    return root;
  }, [object]);

  return (
    <Center>
      <primitive
        object={processed}
        scale={variant === "intro" ? 1.15 : 1.0}
        rotation={[0.15, Math.PI / 6, 0]} // adjust if needed
      />
    </Center>
  );
}

export default function StonicModel({ variant = "hero" }) {
  const isIntro = variant === "intro";

  return (
    <div
      className={
        isIntro
          ? "w-[260px] h-[260px] sm:w-[340px] sm:h-[340px]"
          : "w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]"
      }
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 3], fov: 45 }}
        dpr={[1, 2]}
      >
        {/* Lights */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.2}
          castShadow
        />
        <hemisphereLight
          skyColor={new THREE.Color("#22c55e")}
          groundColor={new THREE.Color("#020617")}
          intensity={0.25}
        />

        <Suspense fallback={null}>
          <StonicOBJ variant={variant} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={isIntro ? 1.5 : 0.7}
        />
      </Canvas>
    </div>
  );
}
