'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { HourStat } from '@/types/Analytics.types';

const timezones = [
  "UTC", "Asia/Colombo", "Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Singapore"
];

export default function VisitsByHourChart() {
  const [data, setData] = useState<HourStat[]>([]);
  const [timezone, setTimezone] = useState("Asia/Colombo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    fetch(`${apiUrl}/api/analyze-visits-by-hour?timezone=${timezone}`)
      .then(res => res.json())
      .then((arr: { hour: number; visits: number }[]) => {
        setData(arr);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [timezone]);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px #0002",
      maxWidth: 600,
      margin: "32px auto",
      padding: 28
    }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <label htmlFor="timezone" style={{ fontWeight: 500, fontSize: 17 }}>Timezone:</label>
        <select
          id="timezone"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          style={{
            fontSize: 16,
            padding: "6px 14px",
            borderRadius: 7,
            border: "1px solid #ccc",
            background: "#f9f9ff",
            minWidth: 170
          }}
        >
          {timezones.map(tz => (
            <option value={tz} key={tz}>{tz.replace("_", " ")}</option>
          ))}
        </select>
      </div>
      <div>
        {loading ? (
          <div style={{ textAlign: "center", color: "#888" }}>Loading hourly data…</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} />
              <YAxis label={{ value: 'Visits', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload && payload.length ? (
                    <div style={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      padding: "8px 14px",
                      fontSize: 15,
                      boxShadow: "0 2px 12px #0001"
                    }}>
                      <strong>Hour:</strong> {label}:00<br />
                      <span style={{ color: "#4caf50" }}>
                        <strong>Visits:</strong> {payload[0].value}
                      </span>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="visits" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
