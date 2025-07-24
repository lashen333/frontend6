// src\components\DeviceTypePieChart.tsx
"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import type { DeviceStat } from '@/types/Analytics.types';

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#A28DFF", "#FF6699"
];

export default function DeviceTypePieChart() {
  const [data, setData] = useState<DeviceStat[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-device-type`)
      .then(res => res.json())
      .then((arr: { deviceType: string; count: number }[]) => {
        // Here we process the array in a very clear way:
        const formatted = arr.map(({ deviceType, count }) => {
          return {
            deviceType: deviceType || "Unknown",
            count,
          };
        });
        setData(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch device type data', err);
        setData([]);
      });
  }, []);

  if (!data.length) return <div>Loading device types...</div>;

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
      <h3 style={{ textAlign: "center" }}>Device Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
          nameKey="deviceType"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
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
