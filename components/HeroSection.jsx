// components/HeroSection.jsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import for client-side only 3D canvas
const StonicModel = dynamic(() => import("./StonicModel"), {
  ssr: false,
});

export default function HeroSection() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <section className="min-h-[80vh] relative flex items-center">
      {/* Intro overlay – only shown once on reload */}
      {!introDone && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2.6, duration: 0.7, ease: "easeInOut" }}
          onAnimationComplete={() => setIntroDone(true)}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Glowing circle behind model */}
            <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-emerald-500/10 to-fuchsia-500/20 blur-3xl" />
            <div className="relative" id="1">
              <div className="h-40 w-40 rounded-full border border-cyan-400 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.7)]">
    <img 
      src="/stonic.svg"   // <-- put your GIF path here
      alt="heartbeat animation"
      className="h-full w-full object-cover"
    />
  </div>
            </div>

            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-6 text-center"
            >
              <div className="text-[0.6rem] tracking-[0.3em] uppercase text-cyan-400">
                Initializing
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-[var(--font-orbitron)] tracking-[0.25em] text-slate-100">
                STONIC<span className="text-cyan-400"> AI</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Calibrating sensors • Loading anomaly model
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Main hero content */}
      <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-2 items-center relative z-10">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <p className="text-[0.6rem] sm:text-xs tracking-[0.3em] text-cyan-400 uppercase">
            Structural Health Monitoring
          </p>

          <div className="space-y-2">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-[var(--font-orbitron)] 
                         font-bold tracking-[0.18em] uppercase"
            >
              STONIC <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-[var(--font-inter)]">
              Real-time structural health monitoring with fused{" "}
              <span className="text-cyan-300">vibration</span>,{" "}
              <span className="text-emerald-300">strain</span>, and{" "}
              <span className="text-fuchsia-300">temperature</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-[0.65rem] sm:text-xs">
            <Badge>Edge AI Node</Badge>
            <Badge>Live Anomaly Score</Badge>
            <Badge>Accelerometer · Strain · Temp</Badge>
          </div>
        </motion.div>

        {/* Right: 3D model in hero */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-transparent blur-2xl" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-3 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
              <StonicModel variant="hero" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-200 tracking-wide">
      {children}
    </span>
  );
}






// // components/HeroSection.jsx
// "use client";

// import { motion } from "framer-motion";

// export default function HeroSection() {
//   return (
//     <section className="min-h-[80vh] flex items-center">
//       <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-2 items-center">
//         {/* Left – text */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: "easeOut" }}
//           className="space-y-6"
//         >
//           <p className="text-xs tracking-[0.3em] text-cyan-400 uppercase">
//             Structural Health Monitoring
//           </p>

//           <h1
//             className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight 
//                        font-[var(--font-orbitron)] tracking-tight"
//           >
//             Predict{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
//               Infrastructure Failures
//             </span>{" "}
//             before they happen.
//           </h1>

//           <p className="text-slate-300 text-sm sm:text-base max-w-xl font-[var(--font-inter)]">
//             STONICAI is an AI-powered, edge-optimised SHM node that fuses{" "}
//             <span className="text-cyan-300">
//               accelerometer (X,Y,Z), strain, and temperature
//             </span>{" "}
//             data to detect early micro-damage signatures using a hybrid
//             CNN–LSTM autoencoder.:contentReference[oaicite:1]
//           </p>

//           <div className="flex flex-wrap gap-3">
//             <span className="px-3 py-1 rounded-full border border-cyan-500/60 text-xs uppercase tracking-wide">
//               Edge AI on ESP32
//             </span>
//             <span className="px-3 py-1 rounded-full border border-emerald-500/60 text-xs uppercase tracking-wide">
//               Real-time Anomaly Score
//             </span>
//             <span className="px-3 py-1 rounded-full border border-fuchsia-500/60 text-xs uppercase tracking-wide">
//               Multi-sensor Fusion
//             </span>
//           </div>
//         </motion.div>

//         {/* Right – 3D SVG + subtle animation */}
//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.9, ease: "easeOut" }}
//           className="flex justify-center"
//         >
//           <motion.div
//             animate={{ y: [0, -12, 0] }}
//             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
//             className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]"
//           >
//             {/* Replace this with your real 3D SVG component or <Image> */}
//             <div className="w-full h-full rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_40px_rgba(34,211,238,0.4)] relative overflow-hidden flex items-center justify-center">
//               <div className="absolute inset-6 rounded-full border border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
//               <div className="absolute inset-10 rounded-full border border-slate-700" />
//               <span className="text-xs tracking-[0.25em] uppercase text-slate-300">
//                 3D SVG HERE
//               </span>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
