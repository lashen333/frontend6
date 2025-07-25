// src\components\VariantPerformanceTable.tsx
"use client";

import { useEffect, useState } from "react";
import type { VariantPerformance } from '@/types/VariantPerformance.types';

export default function VariantPerformanceTable() {
  const [data, setData] = useState<VariantPerformance[]>([]);
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/analyze-performance`)
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data.length)
    return (
      <div className="w-full flex justify-center items-center py-12 text-lg text-gray-500">
        Loading variant performance…
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 overflow-x-auto max-w-full border border-gray-200">
      <h3 className="text-xl font-bold p-6 pb-2">Hero Variant Performance</h3>
      <table className="min-w-[800px] w-full text-sm text-left text-gray-700">
        <thead>
          <tr className="bg-gray-50 border-b sticky top-0 z-10">
            <th className="py-3 px-4 font-semibold">Variant</th>
            <th className="py-3 px-4 font-semibold">Heading</th>
            <th className="py-3 px-4 font-semibold">Views</th>
            <th className="py-3 px-4 font-semibold">Clicks</th>
            <th className="py-3 px-4 font-semibold">Avg. Stay Time</th>
            <th className="py-3 px-4 font-semibold">Bounce Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr
              key={v.variantId}
              className={`border-b hover:bg-blue-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="py-2 px-4">{v.variantId.slice(0, 6)}…</td>
              <td className="py-2 px-4 max-w-[250px] truncate">{v.heading || v.title}</td>
              <td className="py-2 px-4 text-center">{v.totalViews}</td>
              <td className="py-2 px-4 text-center">{v.ctaClicks}</td>
              <td className="py-2 px-4 text-center">
                {v.avgStayTime != null
                  ? `${Math.round(v.avgStayTime / 1000)} s`
                  : "—"}
              </td>
              <td className="py-2 px-4 text-center">
                {v.bounceRate != null
                  ? `${(v.bounceRate).toFixed(1)}%`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-2 text-sm text-gray-400">
        <span>Tip:</span> Hover on rows for more details.
      </div>
    </div>
  );
}
