"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {Router, useRouter} from "next/navigation"

export default function SimulationPage() {
  const plotRef = useRef(null);
  const router=useRouter();
  const [nodes, setNodes] = useState([
    { s: "10", x: "0", y: "0", z: "0" },   // Node 1
    { s: "40", x: "10", y: "0", z: "0" },  // Node 2
    { s: "10", x: "5", y: "10", z: "0" },  // Node 3
  ]);

  const [damage, setDamage] = useState({ x: 1, y: 0, z: 0 });

  const handleNodeChange = (index, field, value) => {
    setNodes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const triangulate = () => {
    // Convert node inputs to numbers (fallback 0)
    const n = nodes.map((node) => ({
      s: parseFloat(node.s) || 0,
      x: parseFloat(node.x) || 0,
      y: parseFloat(node.y) || 0,
      z: parseFloat(node.z) || 0,
    }));

    const totalScore = n[0].s + n[1].s + n[2].s;
    if (totalScore === 0) {
      alert("Total anomaly score cannot be 0.");
      return;
    }

    const x_damage =
      (n[0].s * n[0].x + n[1].s * n[1].x + n[2].s * n[2].x) / totalScore;
    const y_damage =
      (n[0].s * n[0].y + n[1].s * n[1].y + n[2].s * n[2].y) / totalScore;
    const z_damage =
      (n[0].s * n[0].z + n[1].s * n[1].z + n[2].s * n[2].z) / totalScore;

    setDamage({ x: x_damage, y: y_damage, z: z_damage });

    // Update Plot
    updatePlot(n, { x: x_damage, y: y_damage, z: z_damage });
  };

  const updatePlot = (nodesNumeric, damagePoint) => {
    if (typeof window === "undefined" || !window.Plotly || !plotRef.current) {
      console.log("yaha")
      return;
    }

    const sensorTrace = {
      x: nodesNumeric.map((n) => n.x),
      y: nodesNumeric.map((n) => n.y),
      z: nodesNumeric.map((n) => n.z),
      mode: "markers+text",
      type: "scatter3d",
      name: "Sensors",
      text: ["Node 1", "Node 2", "Node 3"],
      textposition: "top center",
      marker: {
        size: 11,
        color: "#00e5ff",
        opacity: 0.95,
        symbol: "square",
      },
    };

    const damageTrace = {
      x: [damagePoint.x],
      y: [damagePoint.y],
      z: [damagePoint.z],
      mode: "markers+text",
      type: "scatter3d",
      name: "Damage Source",
      text: ["DAMAGE"],
      textposition: "top center",
      marker: {
        size: 8,
        color: "#ff4081",
        symbol: "circle",
        opacity: 1,
      },
    };

    const layout = {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#e5f7ff" },
      scene: {
        xaxis: { title: "X", gridcolor: "#1b223c", zerolinecolor: "#555" },
        yaxis: { title: "Y", gridcolor: "#1b223c", zerolinecolor: "#555" },
        zaxis: { title: "Z", gridcolor: "#1b223c", zerolinecolor: "#555" },
        aspectmode: "cube",
      },
      margin: { l: 0, r: 0, b: 0, t: 0 },
      showlegend: true,
      legend: { x: 0.02, y: 0.98, bgcolor: "rgba(5,5,16,0.7)" },
    };

    window.Plotly.newPlot(plotRef.current, [sensorTrace, damageTrace], layout, {
      displaylogo: false,
    });
  };

  // Initialize once Plotly is loaded
  useEffect(() => {
    // console.log(window)
    if (typeof window === "undefined" || !window.Plotly){
        return;
    }
    // Run initial triangulation so the plot is populated
    triangulate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(typeof window !== "undefined" && window.Plotly)]);

  const formatCoord = (v) =>
    v === null || Number.isNaN(v) ? "-" : v.toFixed(2);
  const handlepush=()=>{
    router.push("/");
  }

  return (
    <>
      {/* Plotly CDN script */}
      <Script
        src="https://cdn.plot.ly/plotly-2.27.0.min.js"
        strategy="afterInteractive"
      />

      <div
        className="min-h-screen overflow-hidden flex flex-col items-center px-4 pt-2 pb-4"
        style={{
          background:
            "radial-gradient(circle at top, #101436 0, #050510 40%, #000000 100%)",
          color: "#e5f7ff",
          fontFamily:
            '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Header */}
        <div className="w-4/5 max-w-5xl flex items-baseline justify-between py-1">
          <h1
            className="text-sm tracking-[0.18em] uppercase m-0"
            style={{
              fontFamily: '"Orbitron", sans-serif',
              backgroundImage: "linear-gradient(90deg, #00e5ff, #ff4081)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            <span onClick={handlepush} className="cursor-pointer">SHM</span> Damage Localizer
          </h1>
          <div className="text-[0.7rem] opacity-70 text-right leading-tight">
            Weighted anomaly-based triangulation
            <br />
            3D Sensor Field • Live Plot
          </div>
        </div>

        {/* Visualizer */}
        <div className="w-4/5 max-w-5xl [flex:0_0_60vh] flex my-1">
          <div className="bg-[rgba(10,12,28,0.95)] rounded-xl border border-white/10 shadow-[0_0_24px_rgba(124,77,255,0.25)] p-1.5 w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-0.5 text-[0.75rem]">
              <div
                className="uppercase tracking-[0.12em]"
                style={{ fontFamily: '"Orbitron", sans-serif', color: "#7c4dff" }}
              >
                3D Sensor Field
              </div>
              <div className="text-[0.65rem] opacity-65">
                Cube = Sensor • Sphere = Damage
              </div>
            </div>
            <div ref={plotRef} className="flex-1 w-full h-full" />
          </div>
        </div>

        {/* Controls */}
        <div className="w-4/5 max-w-5xl flex-1 flex flex-col gap-1.5">
          {/* Result box */}
          <div className="px-2.5 py-2 bg-gradient-to-r from-[rgba(255,64,129,0.08)] to-[rgba(0,229,255,0.05)] rounded-lg border border-[rgba(255,64,129,0.4)] flex items-center justify-between text-[0.8rem]">
            <div className="text-[0.75rem] uppercase tracking-[0.12em]">
              Calculated Damage Location
            </div>
            <div
              className="font-mono text-[0.8rem]"
              style={{ fontFamily: '"Orbitron", monospace' }}
            >
              X: {formatCoord(damage.x)} , Y: {formatCoord(damage.y)} , Z:{" "}
              {formatCoord(damage.z)}
            </div>
          </div>

          {/* Nodes row */}
          <div className="flex gap-2 max-[900px]:flex-col">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="flex-1 bg-[rgba(10,12,28,0.95)] rounded-lg border border-white/10 shadow-[0_0_18px_rgba(0,229,255,0.08)] p-2 flex items-center gap-2 min-w-0"
              >
                <img
                  src="/node.jpg"
                  alt={`Node ${idx + 1}`}
                  className="w-14 h-14 object-cover rounded-lg border-2 border-[#00e5ff] bg-[#14172e] flex-shrink-0"
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-[0.75rem] tracking-[0.08em] uppercase font-medium text-[#00e5ff]">
                    Node {idx + 1}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {/* S */}
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[0.6rem] text-white/60">
                        Score (S)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="bg-[#080b1c] border border-white/10 text-white text-[0.75rem] rounded px-1.5 py-1 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 w-full"
                        value={nodes[idx].s}
                        onChange={(e) =>
                          handleNodeChange(idx, "s", e.target.value)
                        }
                      />
                    </div>
                    {/* X */}
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[0.6rem] text-white/60">X</label>
                      <input
                        type="number"
                        step="0.1"
                        className="bg-[#080b1c] border border-white/10 text-white text-[0.75rem] rounded px-1.5 py-1 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 w-full"
                        value={nodes[idx].x}
                        onChange={(e) =>
                          handleNodeChange(idx, "x", e.target.value)
                        }
                      />
                    </div>
                    {/* Y */}
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[0.6rem] text-white/60">Y</label>
                      <input
                        type="number"
                        step="0.1"
                        className="bg-[#080b1c] border border-white/10 text-white text-[0.75rem] rounded px-1.5 py-1 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 w-full"
                        value={nodes[idx].y}
                        onChange={(e) =>
                          handleNodeChange(idx, "y", e.target.value)
                        }
                      />
                    </div>
                    {/* Z */}
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[0.6rem] text-white/60">Z</label>
                      <input
                        type="number"
                        step="0.1"
                        className="bg-[#080b1c] border border-white/10 text-white text-[0.75rem] rounded px-1.5 py-1 focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 w-full"
                        value={nodes[idx].z}
                        onChange={(e) =>
                          handleNodeChange(idx, "z", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-1">
            <button
              onClick={triangulate}
              className="mt-0.5 px-5 py-2 rounded-full font-semibold text-[0.8rem] tracking-[0.11em] uppercase border-none cursor-pointer transition-transform duration-150 ease-out hover:-translate-y-[1px] hover:shadow-[0_0_16px_rgba(0,229,255,0.35)]"
              style={{
                background:
                  "linear-gradient(90deg, #00e5ff 0%, #ff4081 100%)",
                color: "#050510",
              }}
            >
              Triangulate Damage
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
