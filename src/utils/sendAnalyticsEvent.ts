// src\utils\sendAnalyticsEvent.ts
import { getVisitorId } from "./visitorId";
import { getUTMParams } from "./utm";

export function sendAnalyticsEvent(
  event: string,
  data: any = {},
  location?: { lat?: number; lon?: number }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const payload = {
    event,
    variantId: data.variantId || "default",
    visitorId: getVisitorId(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    timestamp: Date.now(),
    utms: getUTMParams(),
    ...location,   // spreads lat/lon if available
    ...data,       // spreads additional fields (e.g. value)
  };
  fetch(`${apiUrl}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
