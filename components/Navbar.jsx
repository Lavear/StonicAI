// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Router, { useRouter } from "next/navigation";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "dashboard", label: "Dashboard" },
  { id: "simulation", label: "Simulation" },
];

export default function Navbar() {
  const router=useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (id) => {
    if(id==='simulation'){
      router.push("/simulation")
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
          : "bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
       
  {/* Logo Image */}
 <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleScroll("home")}
        >
          <div className="h-8 w-8 rounded-full border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.7)]">
            <span className="text-xs tracking-widest font-semibold">SHM</span>
          </div>
          <div className="font-semibold tracking-widest text-sm sm:text-base">
            STONIC<span className="text-cyan-400">AI</span>
          </div>
        </div> 



        <div className="hidden sm:flex items-center gap-6 text-xs sm:text-sm">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScroll(s.id)}
              className="cursor-pointer hover:underline uppercase tracking-wide text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
