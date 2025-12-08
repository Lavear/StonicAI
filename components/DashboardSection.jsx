"use client";

import { useEffect, useMemo, useState } from "react";

const ROW_COUNT = 10;

// Format timestamp nicely if it is ISO or epoch
function formatTimestamp(ts) {
  if (!ts) return "-";
  try {
    // If numeric -> treat as ms or s
    if (typeof ts === "number") {
      const ms = ts > 1e12 ? ts : ts * 1000;
      return new Date(ms).toLocaleTimeString();
    }
    // If string -> Date parse
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString();
    }
    return String(ts);
  } catch {
    return String(ts);
  }
}

export default function DashboardSection() {
  const [rows, setRows] = useState([]);
  const [retryIndex, setRetryIndex] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // TODO: replace this URL with your actual ESP32 WS endpoint
    const socket = new WebSocket("ws://10.51.223.246:4000");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const anomalyScore =
          data.anomaly_score ??
          data.anomalyScore ??
          data.score ??
          null;

        const isAnomaly =
          data.anomaly === 1 ||
          data.anomaly === true ||
          (typeof anomalyScore === "number" && anomalyScore > 0.35);

        const newRow = {
          id: Date.now(),
          timestamp: data.timestamp ?? data.time ?? null,
          microstrain: data.microstrain ?? data.strain ?? null,
          temp: data.temp ?? data.temperature ?? null,
          humidity: data.humidity ?? null,
          ax: data.ax ?? data.accel_x ?? null,
          ay: data.ay ?? data.accel_y ?? null,
          az: data.az ?? data.accel_z ?? null,
          gx: data.gx ?? data.gyro_x ?? null,
          gy: data.gy ?? data.gyro_y ?? null,
          gz: data.gz ?? data.gyro_z ?? null,
          anomalyScore: anomalyScore,
          isAnomaly,
        };

        setRows((prev) => [newRow, ...prev].slice(0, ROW_COUNT));
      } catch (err) {
        console.error("Invalid WebSocket data:", event.data, err);
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

  const hasAnomaly = useMemo(
    () => rows.some((r) => r.isAnomaly),
    [rows]
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold font-[var(--font-orbitron)] tracking-wide">
            Live Health Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Streaming structural data via WebSocket: strain, DHT, accelerometer and gyroscope.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <AnomalyStatusBadge hasAnomaly={hasAnomaly} />
          <ConnectionStatusBadge connected={connected} />
        </div>
      </div>

      <div
        className={`rounded-3xl border-2 ${
          hasAnomaly
            ? "border-red-500 shadow-[0_0_30px_rgba(248,113,113,0.45)]"
            : "border-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.45)]"
        } bg-slate-950/80 backdrop-blur-lg overflow-hidden transition-all`}
      >
        <div className="border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <div className="text-xs sm:text-sm uppercase tracking-wide text-slate-300">
            Sensor Snapshot
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400">
            Strain • DHT (Temp &amp; Humidity) • Accelerometer (X,Y,Z) • Gyroscope (X,Y,Z)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              {/* Group headers */}
              <tr className="bg-slate-900/80 text-slate-300">
                <Th rowSpan={2}>#</Th>
                <Th rowSpan={2}>Time</Th>
                <Th rowSpan={2}>Strain (µε)</Th>
                <Th colSpan={2}>DHT</Th>
                <Th colSpan={3}>Accelerometer (g)</Th>
                <Th colSpan={3}>Gyroscope (°/s)</Th>
                <Th rowSpan={2}>Anom.</Th>
              </tr>
              <tr className="bg-slate-900/80 text-slate-300">
                <ThSub>Temp (°C)</ThSub>
                <ThSub>Humidity (%)</ThSub>
                <ThSub>X</ThSub>
                <ThSub>Y</ThSub>
                <ThSub>Z</ThSub>
                <ThSub>X</ThSub>
                <ThSub>Y</ThSub>
                <ThSub>Z</ThSub>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-6 text-center text-slate-500 text-xs"
                  >
                    Waiting for sensor data…
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
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
                    <Td>{formatTimestamp(row.timestamp)}</Td>
                    <Td>{row.microstrain ?? "-"}</Td>

                    <Td>{row.temp ?? "-"}</Td>
                    <Td>{row.humidity ?? "-"}</Td>

                    <Td>{row.ax ?? "-"}</Td>
                    <Td>{row.ay ?? "-"}</Td>
                    <Td>{row.az ?? "-"}</Td>

                    <Td>{row.gx ?? "-"}</Td>
                    <Td>{row.gy ?? "-"}</Td>
                    <Td>{row.gz ?? "-"}</Td>

                    <Td>
                      {row.anomalyScore != null ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                            row.isAnomaly
                              ? "bg-red-500/20 text-red-300 border border-red-500/40"
                              : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {row.anomalyScore.toFixed(3)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">-</span>
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children, rowSpan, colSpan }) {
  return (
    <th
      rowSpan={rowSpan}
      colSpan={colSpan}
      className="px-3 sm:px-4 py-2 border-b border-slate-800 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
    >
      {children}
    </th>
  );
}

function ThSub({ children }) {
  return (
    <th className="px-3 sm:px-4 py-1 border-b border-slate-800 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
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
