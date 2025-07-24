// src\components\CountryPieChart.tsx
"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import type { CountryStat } from '@/types/Analytics.types';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

export default function CountryPieChart() {
  const [data, setData] = useState<CountryStat[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-geo-performance`)
      .then(res => res.json())
      .then((arr: { country: string; count: number }[]) => {
        // Map backend result to recharts format
        const formatted: CountryStat[] = arr.map(({ country, count }) => ({
          country: country || "Unknown",
          value: count
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch country data', err);
        setData([]);
      });
  }, []);

  if (!data.length) return <div>Loading countries...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="country"
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
  );
}
