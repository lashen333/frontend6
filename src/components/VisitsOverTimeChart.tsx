// src\components\VisitsOverTimeChart.tsx
"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DateStat } from '@/types/Analytics.types';

export default function VisitsOverTimeChart() {
  const [data, setData] = useState<DateStat[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-visits-over-time`)
      .then(res => res.json())
      .then((arr: DateStat[]) => {
        setData(arr);
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
      maxWidth: 600
    }}>
      <h3 style={{ textAlign: "center" }}>Visits Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
