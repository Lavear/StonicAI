// components/VisualizationsSection.jsx
"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Dummy time-series; replace with parsed CSV later
const dummyTimeSeries = Array.from({ length: 30 }, (_, i) => {
  const t = i; // seconds

  const strain = 150 + Math.sin(i / 3) * 60 + Math.random() * 10;
  const temp = 28 + Math.cos(i / 5) * 3 + Math.random();

  // Accelerometer dummy data (m/s² or g)
  const accX = 0.2 + Math.sin(i / 4) * 0.5 + Math.random() * 0.05;
  const accY = -0.1 + Math.cos(i / 3.5) * 0.4 + Math.random() * 0.05;
  const accZ = 1 + Math.sin(i / 5) * 0.3 + Math.random() * 0.05;

  // Gyroscope dummy data (deg/s)
  const gyroX = Math.sin(i / 6) * 20 + Math.random() * 2;
  const gyroY = Math.cos(i / 7) * 25 + Math.random() * 2;
  const gyroZ = Math.sin(i / 5.5) * 15 + Math.random() * 2;

  return {
    t,
    strain: +strain.toFixed(2),
    temp: +temp.toFixed(2),
    accX: +accX.toFixed(3),
    accY: +accY.toFixed(3),
    accZ: +accZ.toFixed(3),
    gyroX: +gyroX.toFixed(2),
    gyroY: +gyroY.toFixed(2),
    gyroZ: +gyroZ.toFixed(2),
  };
});

export default function VisualizationsSection() {
  const timeLabels = dummyTimeSeries.map((p) => `${p.t}s`);

  const strainData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Strain (µε)",
        data: dummyTimeSeries.map((p) => p.strain),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const tempData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: dummyTimeSeries.map((p) => p.temp),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const accXData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Acc X (m/s²)",
        data: dummyTimeSeries.map((p) => p.accX),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const accYData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Acc Y (m/s²)",
        data: dummyTimeSeries.map((p) => p.accY),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const accZData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Acc Z (m/s²)",
        data: dummyTimeSeries.map((p) => p.accZ),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const gyroXData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Gyro X (°/s)",
        data: dummyTimeSeries.map((p) => p.gyroX),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const gyroYData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Gyro Y (°/s)",
        data: dummyTimeSeries.map((p) => p.gyroY),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const gyroZData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Gyro Z (°/s)",
        data: dummyTimeSeries.map((p) => p.gyroZ),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", maxTicksLimit: 8 },
        grid: { color: "rgba(148,163,184,0.15)" },
      },
      y: {
        ticks: { color: "#9ca3af", maxTicksLimit: 6 },
        grid: { color: "rgba(148,163,184,0.15)" },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold font-[var(--font-orbitron)] tracking-wide">
            Graphs & Visualizations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Visualising strain, temperature, acceleration and rotational motion
            over time helps correlate anomaly spikes with structural loading and
            environmental changes.
          </p>
        </div>
      </div>

      {/* Strain & Temperature */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Strain vs Time" subtitle="µε over recent window">
          <Line
            data={{
              ...strainData,
              datasets: strainData.datasets.map((d) => ({
                ...d,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.1)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard
          title="Temperature vs Time"
          subtitle="°C profile of sensor node"
        >
          <Line
            data={{
              ...tempData,
              datasets: tempData.datasets.map((d) => ({
                ...d,
                borderColor: "#22d3ee",
                backgroundColor: "rgba(34,211,238,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>
      </div>

      {/* Accelerometer X/Y/Z */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
        Accelerometer (X, Y, Z) vs Time
      </h3>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Acc X vs Time" subtitle="Linear acceleration - X">
          <Line
            data={{
              ...accXData,
              datasets: accXData.datasets.map((d) => ({
                ...d,
                borderColor: "#f97316",
                backgroundColor: "rgba(249,115,22,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Acc Y vs Time" subtitle="Linear acceleration - Y">
          <Line
            data={{
              ...accYData,
              datasets: accYData.datasets.map((d) => ({
                ...d,
                borderColor: "#a855f7",
                backgroundColor: "rgba(168,85,247,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Acc Z vs Time" subtitle="Linear acceleration - Z">
          <Line
            data={{
              ...accZData,
              datasets: accZData.datasets.map((d) => ({
                ...d,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>
      </div>

      {/* Gyroscope X/Y/Z */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
        Gyroscope (X, Y, Z) vs Time
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        <ChartCard title="Gyro X vs Time" subtitle="Angular rate - X">
          <Line
            data={{
              ...gyroXData,
              datasets: gyroXData.datasets.map((d) => ({
                ...d,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Gyro Y vs Time" subtitle="Angular rate - Y">
          <Line
            data={{
              ...gyroYData,
              datasets: gyroYData.datasets.map((d) => ({
                ...d,
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14,165,233,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Gyro Z vs Time" subtitle="Angular rate - Z">
          <Line
            data={{
              ...gyroZData,
              datasets: gyroZData.datasets.map((d) => ({
                ...d,
                borderColor: "#eab308",
                backgroundColor: "rgba(234,179,8,0.12)",
              })),
            }}
            options={commonOptions}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="border border-slate-800 rounded-3xl bg-slate-950/80 p-4 sm:p-5 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
      <div className="h-64 sm:h-72">{children}</div>
    </div>
  );
}
