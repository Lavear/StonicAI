// components/AboutSection.jsx

export default function AboutSection() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="border border-slate-800 rounded-3xl bg-slate-900/40 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent pointer-events-none" />
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 font-[var(--font-orbitron)] tracking-wide">
          About the System
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Modern buildings, bridges and industrial assets experience continuous
          stress from vibration, load, and environmental changes. Our system
          attaches a low-cost SHM node with an{" "}
          <span className="text-cyan-300">
            ESP32, 3-axis accelerometer, strain gauge, and temperature sensor
          </span>
          . Time-series windows are fed into a{" "}
          <span className="text-emerald-300">
            pretrained 1D-CNN encoder and building-specific LSTM decoder
          </span>{" "}
          to reconstruct healthy behavior and score anomalies using
          reconstruction error.:contentReference[oaicite:2]
        </p>

        <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <StatCard
            title="Sensors"
            value="Accel + Strain + Temp"
            note="5 synchronized channels"
          />
          <StatCard
            title="Health States"
            value="Healthy / Minor / Severe"
            note="Mapped to anomaly score"
          />
          <StatCard
            title="Deployment"
            value="Edge on ESP32"
            note="Low-latency inference"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, note }) {
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/70 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-sm font-semibold text-cyan-300">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{note}</div>
    </div>
  );
}
