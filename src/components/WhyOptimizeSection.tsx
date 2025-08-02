// src\components\WhyOptimizeSection.tsx
"use client";

import {getVisitorId} from "@/utils/visitorId";
import {getUTMParams} from "@/utils/utm";

export default function WhyOptimizeSection({
  title,
  boxes,
  _id: variantId,
}: {
  title: string;
  boxes: { heading: string; description: string }[];
  _id: string;
}) {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleClick = async (boxIndex: number) => {
    await fetch(`${apiUrl}/api/track-why-optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "why_optimize_box_click",
        variantId,
        boxIndex,
        userId: getVisitorId(),
        utms: getUTMParams(),
        timestamp: Date.now(),
      }),
    }); 

  };
  return (
    <section className="relative py-16 px-6 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3 animate-pulse delay-200"></div>

      {/* Section title */}
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-yellow-400 text-center mb-12 animate-fadeInDown"
        style={{ animationDelay: "0.2s" }}
      >
        {title}
      </h2>

      {/* Boxes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            className="bg-gray-900 border border-yellow-400/30 rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
          >
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">
              {box.heading}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {box.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
