// src\components\BrowserPieChart.tsx
"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import type { BrowserStat } from '@/types/Analytics.types';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function BrowserPieChart() {
  const [data, setData] = useState<BrowserStat[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-browser-usage`)
      .then(res => res.json())
      .then((arr: { browser: string; count: number }[]) => {
        setData(arr.map(({ browser, count }) => ({
          browser: browser || "Unknown",
          value: count      // <<< this must be 'value', NOT 'count'
        })));
      });
  }, []);

  if (!data.length) return <div style={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>;
  


  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px #0001",
      padding: 16,
      margin: 24,
      minWidth: 340,
      maxWidth: 400
    }}>
      <h3 style={{ textAlign: "center" }}>Browser Usage</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"   // <<< this must be 'value'
            nameKey="browser"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={35}
            label
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
