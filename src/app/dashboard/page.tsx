// src\app\dashboard\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { VariantPerformance } from '@/types/VariantPerformance.types';

export default function DashboardPage() {
    const [data, setData] = useState<VariantPerformance[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('http://localhost:5000/api/analyze-performance');
                const text = await res.text();

                try {
                    const json = JSON.parse(text);
                    setData(json);
                } catch (e) {
                    console.error('❌ Not valid JSON, got:', text);
                    setError('Invalid response from server (not JSON)');
                }
            } catch (err: any) {
                console.error('❌ Fetch failed:', err);
                setError('Failed to fetch data');
            }
        }

        fetchStats();
    }, []);

    if (error) {
        return <div className="p-10 text-red-500 text-center">{error}</div>;
    }

    if (!data.length) {
        return <div className="p-10 text-center">Loading analytics...</div>;
    }
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">📊 Variant Performance Dashboard</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Variant ID</th>
                        <th className="p-2 border">Heading</th>
                        <th className="p-2 border">Subtitle</th>
                        <th className="p-2 border">CTA Text</th>
                        <th className="p-2 border">Views</th>
                        <th className="p-2 border">CTA Clicks</th>
                        <th className="p-2 border">Avg. Stay Time (ms)</th>
                        <th className="p-2 border">Bounce Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((v) => (
                        <tr key={v.variantId} className="text-center border-b text-sm">
                            <td className="p-2 border">{v.variantId}</td>
                            <td className="p-2 border">{v.heading}</td>
                            <td className="p-2 border">{v.subtitle}</td>
                            <td className="p-2 border">{v.ctaText}</td>
                            <td className="p-2 border">{v.totalViews ?? 0}</td>
                            <td className="p-2 border">{v.ctaClicks ?? 0}</td>
                            <td className="p-2 border">{Math.round(v.avgStayTime ?? 0)}</td>
                            <td className="p-2 border">{(v.bounceRate ?? 0).toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
