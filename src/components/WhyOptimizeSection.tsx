// src/components/WhyOptimizeSection.tsx
"use client";

import { getVisitorId } from "@/utils/visitorId";
import { getUTMParams } from "@/utils/utm";

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
    <section className="relative py-20 px-6 bg-[#0b0f19] border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-yellow-400">
          {title}
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxes.map((box, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className="text-left rounded-2xl p-6 bg-[#11162a] border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60"
            >
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                {box.heading}
              </h3>
              <p className="text-sm leading-relaxed text-gray-200/90">
                {box.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
