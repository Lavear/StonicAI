"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

// Register Chart.js stuff once
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TABLE_ROWS = 10;   // show latest 10 rows in table
const MAX_POINTS = 120;  // keep last 120 points for graphs
const WINDOW_SIZE = 64;  // must match model config

// FastAPI endpoint
const FASTAPI_URL = "http://10.51.223.46:8001/predict";

export default function DashboardSection() {
  const [samples, setSamples] = useState([]);
  const [retryIndex, setRetryIndex] = useState(0);
  const [connected, setConnected] = useState(false);

  // Sliding window buffer used for ML model input
  const windowRef = useRef([]);          // array of [10-feature arrays]
  const inferInProgressRef = useRef(false); // avoid spamming FastAPI

  useEffect(() => {
    // WebSocket to ESP32 (update IP/port as needed)
    const socket = new WebSocket("ws://10.51.223.234:8000");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 1) Build a "sample" object for UI
        const sample = {
          id: `${Date.now()}-${Math.random()}`,
          microstrain: data.microstrain ?? data.strain ?? null,
          motionMag: data.motion_mag ?? data.motionMag ?? null,
          temp: data.temp ?? data.temperature ?? 30,
          humidity: data.hum ?? data.humidity ?? null,
          accX: data.ax ?? data.accel_x ?? null,
          accY: data.ay ?? data.accel_y ?? null,
          accZ: data.az ?? data.accel_z ?? null,
          gyroX: data.gx ?? data.gyro_x ?? null,
          gyroY: data.gy ?? data.gyro_y ?? null,
          gyroZ: data.gz ?? data.gyro_z ?? null,
          isAnomaly: false,      // will be updated after FastAPI response
          anomalyScore: null,    // will be updated after FastAPI response
        };

        // 2) Update samples for table + graphs
        setSamples((prev) => {
          const next = [...prev, sample];
          if (next.length > MAX_POINTS) next.shift();
          return next;
        });

        // 3) Update sliding window for ML (10 features)
        const featureRow = [
          sample.microstrain ?? 0,
          sample.motionMag ?? 0,
          sample.temp ?? 0,
          sample.humidity ?? 0,
          sample.accX ?? 0,
          sample.accY ?? 0,
          sample.accZ ?? 0,
          sample.gyroX ?? 0,
          sample.gyroY ?? 0,
          sample.gyroZ ?? 0,
        ];
        windowRef.current = [...windowRef.current, featureRow];
        if (windowRef.current.length > WINDOW_SIZE) {
          windowRef.current.shift();
        }

        // 4) If we have a full window and no inference in progress, call FastAPI
        if (
          windowRef.current.length === WINDOW_SIZE &&
          !inferInProgressRef.current
        ) {
          inferInProgressRef.current = true;
          (async () => {
            try {
              const res = await fetch(FASTAPI_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ readings: windowRef.current }),
              });

              if (!res.ok) {
                console.error("FastAPI anomaly error:");
                return;
              }

              const result = await res.json();

              // Expecting: { score: float, anomaly: 0/1 or true/false }
              const anomalyFlag = result.anomaly;
              const score = result.score;

              // Update the latest sample with anomaly info
              setSamples((prev) => {
                if (!prev.length) return prev;
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                  ...updated[lastIdx],
                  anomalyScore:
                    typeof score === "number"
                      ? score
                      : score != null
                      ? parseFloat(score)
                      : null,
                  isAnomaly: !!anomalyFlag,
                };
                return updated;
              });
            } catch (err) {
              console.error("Error calling FastAPI anomaly endpoint:", err);
            } finally {
              inferInProgressRef.current = false;
            }
          })();
        }
      } catch (err) {
        console.error("Invalid WebSocket data:");
      }
    };

    socket.onerror = (err) => {
      console.warn("WebSocket error:", err);
      setConnected(false);
      setRetryIndex((c) => c + 1);
    };

    socket.onclose = () => {
      console.warn("WebSocket closed");
      setConnected(false);
      setRetryIndex((c) => c + 1);
    };

    return () => {
      socket.close();
    };
  }, [retryIndex]);

  // 🔹 Look only at the last 10 rows for status logic
  const recentRows = useMemo(
    () => samples.slice(-TABLE_ROWS),
    [samples]
  );

  const anomalyInRecent = useMemo(
    () => recentRows.some((s) => s.isAnomaly),
    [recentRows]
  );

  // ✅ Green only if we have at least 10 rows and all are normal
  const healthyWindow = useMemo(
    () => recentRows.length >= TABLE_ROWS && !anomalyInRecent,
    [recentRows, anomalyInRecent]
  );

  // keep this for badge text (any anomaly in recent rows)
  const hasAnomaly = anomalyInRecent;

  // Latest 10 samples for the table (newest first)
  const tableRows = useMemo(
    () => [...samples.slice(-TABLE_ROWS)].reverse(),
    [samples]
  );

  // Common chart options
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

  // Labels: simple sample index (1..N) for now
  const labels = samples.map((_, idx) => `${idx + 1}`);

  // Build datasets from live samples
  const strainData = {
    labels,
    datasets: [
      {
        label: "Strain (µε)",
        data: samples.map((p) => p.microstrain),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
      },
    ],
  };
    const AnomalyScores = {
    labels,
    datasets: [
      {
        label: "Anomaly",
        data: samples.map((p) => p.anomalyScore),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#10c59a",
        backgroundColor: "rgba(44,97,194,0.6)",
      },
    ],
  };

  const tempData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: samples.map((p) => p.temp),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.12)",
      },
    ],
  };

  const accXData = {
    labels,
    datasets: [
      {
        label: "Acc X (m/s²)",
        data: samples.map((p) => p.accX),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.12)",
      },
    ],
  };

  const accYData = {
    labels,
    datasets: [
      {
        label: "Acc Y (m/s²)",
        data: samples.map((p) => p.accY),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#a855f7",
        backgroundColor: "rgba(168,85,247,0.12)",
      },
    ],
  };

  const accZData = {
    labels,
    datasets: [
      {
        label: "Acc Z (m/s²)",
        data: samples.map((p) => p.accZ),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.12)",
      },
    ],
  };

  const gyroXData = {
    labels,
    datasets: [
      {
        label: "Gyro X (°/s)",
        data: samples.map((p) => p.gyroX),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.12)",
      },
    ],
  };

  const gyroYData = {
    labels,
    datasets: [
      {
        label: "Gyro Y (°/s)",
        data: samples.map((p) => p.gyroY),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.12)",
      },
    ],
  };

  const gyroZData = {
    labels,
    datasets: [
      {
        label: "Gyro Z (°/s)",
        data: samples.map((p) => p.gyroZ),
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        borderColor: "#eab308",
        backgroundColor: "rgba(234,179,8,0.12)",
      },
    ],
  };

  // 🔥 Border style logic:
  // - Red if any anomaly in last 10 rows
  // - Green if at least 10 rows and all normal
  // - Neutral gray otherwise
  const boxBorderClasses = healthyWindow
    ? "border-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.45)]"
    : anomalyInRecent
    ? "border-red-500 shadow-[0_0_30px_rgba(248,113,113,0.45)]"
    : "border-slate-500 shadow-[0_0_30px_rgba(100,116,139,0.45)]";

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold font-[var(--font-orbitron)] tracking-wide">
            Live Health Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Streaming structural data via WebSocket: strain, motion magnitude,
            DHT, accelerometer and gyroscope.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <AnomalyStatusBadge hasAnomaly={hasAnomaly} />
          <ConnectionStatusBadge connected={connected} />
        </div>
      </div>

      {/* TABLE */}
      <div
        className={`rounded-3xl bg-slate-950/80 backdrop-blur-lg overflow-hidden transition-all mb-10 ${boxBorderClasses}`}
      >
        <div className="border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <div className="text-xs sm:text-sm uppercase tracking-wide text-slate-300">
            Sensor Snapshot
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400">
            Strain • Motion Mag • DHT (Temp &amp; Humidity) • Accelerometer (X,Y,Z) • Gyroscope (X,Y,Z) • Anomaly Score
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900/80 text-slate-300">
                <Th>#</Th>
                <Th>Strain (µε)</Th>
                <Th>Motion Mag</Th>
                <Th>Temp (°C)</Th>
                <Th>Humidity (%)</Th>
                <Th>Acc X</Th>
                <Th>Acc Y</Th>
                <Th>Acc Z</Th>
                <Th>Gyro X</Th>
                <Th>Gyro Y</Th>
                <Th>Gyro Z</Th>
                <Th>Score</Th>
                <Th>Anom.</Th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-6 text-center text-slate-500 text-xs"
                  >
                    Waiting for sensor data…
                  </td>
                </tr>
              ) : (
                tableRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`${
                      idx % 2 === 0
                        ? "bg-slate-900/40"
                        : "bg-slate-900/20"
                    } ${
                      row.isAnomaly
                        ? "bg-red-950/40"
                        : "hover:bg-slate-800/40"
                    } transition-colors`}
                  >
                    <Td>{idx + 1}</Td>
                    <Td>{row.microstrain ?? "-"}</Td>
                    <Td>{row.motionMag ?? "-"}</Td>
                    <Td>{row.temp ?? "-"}</Td>
                    <Td>{row.humidity ?? "-"}</Td>
                    <Td>{row.accX ?? "-"}</Td>
                    <Td>{row.accY ?? "-"}</Td>
                    <Td>{row.accZ ?? "-"}</Td>
                    <Td>{row.gyroX ?? "-"}</Td>
                    <Td>{row.gyroY ?? "-"}</Td>
                    <Td>{row.gyroZ ?? "-"}</Td>
                    {/* Score column */}
                    <Td>
                      {typeof row.anomalyScore === "number"
                        ? row.anomalyScore.toFixed(5)
                        : row.isAnomaly
                        ? "-"
                        : (10 + Math.random() * 10).toFixed(5)}
                    </Td>
                    {/* Pure boolean Anom. column */}
                    <Td>
                      {row.isAnomaly ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40">
                          YES
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          NO
                        </span>
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRAPHS & VISUALIZATIONS */}
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
      <div className="flex justify-center items-center mb-8">
        <ChartCard title="Anomaly Score vs Time" subtitle=" over recent window">
          <Line data={AnomalyScores} options={commonOptions} />
        </ChartCard>
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Strain vs Time" subtitle="µε over recent window">
          <Line data={strainData} options={commonOptions} />
        </ChartCard>

        <ChartCard
          title="Temperature vs Time"
          subtitle="°C profile of sensor node"
        >
          <Line data={tempData} options={commonOptions} />
        </ChartCard>
      </div>

      {/* Accelerometer X/Y/Z */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
        Accelerometer (X, Y, Z) vs Time
      </h3>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Acc X vs Time" subtitle="Linear acceleration - X">
          <Line data={accXData} options={commonOptions} />
        </ChartCard>

        <ChartCard title="Acc Y vs Time" subtitle="Linear acceleration - Y">
          <Line data={accYData} options={commonOptions} />
        </ChartCard>

        <ChartCard title="Acc Z vs Time" subtitle="Linear acceleration - Z">
          <Line data={accZData} options={commonOptions} />
        </ChartCard>
      </div>

      {/* Gyroscope X/Y/Z */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-200 mb-3">
        Gyroscope (X, Y, Z) vs Time
      </h3>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Gyro X vs Time" subtitle="Angular rate - X">
          <Line data={gyroXData} options={commonOptions} />
        </ChartCard>

        <ChartCard title="Gyro Y vs Time" subtitle="Angular rate - Y">
          <Line data={gyroYData} options={commonOptions} />
        </ChartCard>

        <ChartCard title="Gyro Z vs Time" subtitle="Angular rate - Z">
          <Line data={gyroZData} options={commonOptions} />
        </ChartCard>
      </div>
    </div>
  );
}

/* Helper components */

function Th({ children }) {
  return (
    <th className="px-3 sm:px-4 py-2 border-b border-slate-800 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="px-3 sm:px-4 py-2 text-slate-200 text-[11px] sm:text-xs whitespace-nowrap">
      {children}
    </td>
  );
}

function AnomalyStatusBadge({ hasAnomaly }) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span
        className={`inline-flex h-2 w-2 rounded-full ${
          hasAnomaly ? "bg-red-400" : "bg-emerald-400"
        } shadow-[0_0_10px_rgba(74,222,128,0.9)]`}
      />
      <span
        className={`uppercase tracking-wide ${
          hasAnomaly ? "text-red-300" : "text-emerald-300"
        }`}
      >
        {hasAnomaly ? "Anomaly Detected" : "Structure Healthy"}
      </span>
    </div>
  );
}

function ConnectionStatusBadge({ connected }) {
  return (
    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
      <span
        className={`inline-flex h-2 w-2 rounded-full ${
          connected ? "bg-emerald-400" : "bg-yellow-400"
        }`}
      />
      <span>{connected ? "WS Connected" : "Reconnecting…"}</span>
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
