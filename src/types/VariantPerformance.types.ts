// src\types\VariantPerformance.types.ts

export interface VariantPerformance {
  heading?: string;        // <-- add this if missing
  subtitle?: string;
  title?: string;          // <-- add this if missing
  ctaText?: string;
  variantId: string;
  totalViews?: number;
  ctaClicks?: number;
  avgStayTime?: number;
  bounceRate?: number;
}
