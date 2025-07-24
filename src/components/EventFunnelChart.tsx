// src\components\EventFunnelChart.tsx
"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import type { FunnelStat } from '@/types/Analytics.types';

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page Viewed",
  cta_click: "CTA Clicked",
  stay_time: "Stayed (sec)",
  // Add more if needed
};

export default function EventFunnelChart() {
  const [data, setData] = useState<FunnelStat[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-event-funnel`)
      .then(res => res.json())
      .then((arr: FunnelStat[]) => {
        // Optionally, sort by funnel step order
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
      <h3 style={{ textAlign: "center" }}>Event Funnel</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="event" tickFormatter={e => EVENT_LABELS[e] || e} />
          <YAxis />
          <Tooltip formatter={(v, name, props) => [v, EVENT_LABELS[props.payload.event] || props.payload.event]} />
          <Bar dataKey="count" fill="#8884d8">
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
