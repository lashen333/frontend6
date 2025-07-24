// src\components\VariantPerformanceTable.tsx
"use client";

import { useEffect, useState } from "react";

export default function VariantPerformanceTable() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-performance`) // update URL if needed
      .then(res => res.json())
      .then(setData);
  }, []);
  if (!data.length) return <div>Loading...</div>;

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          <th>Variant</th>
          <th>Heading</th>
          <th>Views</th>
          <th>Clicks</th>
          <th>Avg. Stay Time (s)</th>
          <th>Bounce Rate (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map(v => (
          <tr key={v.variantId}>
            <td>{v.variantId}</td>
            <td>{v.heading || v.title}</td>
            <td>{v.totalViews}</td>
            <td>{v.ctaClicks}</td>
            <td>{Math.round((v.avgStayTime ?? 0) / 1000)}</td>
            <td>{(v.bounceRate ?? 0).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
