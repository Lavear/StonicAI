// components/StonicModel.jsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  Center,
  Bounds,
} from "@react-three/drei";
import { Suspense, useRef } from "react";

// --- Model Wrapper to Apply Continuous Animation ---
function StonicAnimated({ scale }) {
  const { scene } = useGLTF("/models/stonic.glb");
  const ref = useRef();

  // Smooth continuous rotation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // 0.5 = rotate speed
    }
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={scale} />
    </Center>
  );
}

useGLTF.preload("/models/stonic.glb");

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
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 7], fov: 35 }}   // ZOOMED OUT + HIGH ANGLE
      >
        <color attach="background" args={["#020617"]} />

        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 3]} intensity={1.5} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            {/* SHRINK THE MODEL (critical) */}
            <StonicAnimated scale={0.01} />
          </Bounds>

          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}  // You want auto animation only
        />
      </Canvas>
    </div>
  );
}



// // components/StonicModel.jsx
// "use client";

// import { Canvas } from "@react-three/fiber";
// import {
//   Environment,
//   OrbitControls,
//   useGLTF,
//   Center,
// } from "@react-three/drei";
// import { Suspense } from "react";

// function StonicGLB({ scale = 1 }) {
//   const { scene } = useGLTF("/models/stonic.glb");

//   // Debug: log once so you know it actually loaded
//   console.log("GLB loaded:", scene);

//   return (
//     <Center>
//       <primitive object={scene} scale={scale} />
//     </Center>
//   );
// }

// // Preload for faster first render (keep this)
// useGLTF.preload("/models/stonic.glb");

// export default function StonicModel({ variant = "hero" }) {
//   const isIntro = variant === "intro";

//   return (
//     <div
//       className={
//         isIntro
//           ? "w-[260px] h-[260px] sm:w-[340px] sm:h-[340px]"
//           : "w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]"
//       }
//     >
//       <Canvas
//         camera={{ position: [0, 2, 10], fov: 40 }}
//         dpr={[1, 2]}
//       >
//         {/* So you can see that the canvas is actually there */}
//         <color attach="background" args={["#020617"]} />

//         <ambientLight intensity={0.7} />
//         <directionalLight position={[3, 4, 2]} intensity={1.4} />

//         <Suspense fallback={null}>
//           {/* Start with scale 1; adjust after you see it */}
//           <StonicGLB scale={0.03}/>
//           <Environment preset="city" />
//         </Suspense>

//         {/* Enable zoom/pan for debugging the model size/position */}
//         <OrbitControls
//           enablePan
//           enableZoom
//           autoRotate={isIntro}
//           autoRotateSpeed={isIntro ? 1.6 : 0.8}
//         />
//       </Canvas>
//     </div>
//   );
// }
