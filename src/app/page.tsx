// src\app\page.tsx
import GeoTracker from '@/components/GeoTracker';
import HeroLoader from '@/components/HeroLoader';
import WhyOptimizeLoader from '@/components/WhyOptimizeLoader';

async function getVariant(sp: Record<string, string | string[] | undefined>) {
  const qs = new URLSearchParams();
  for (const k of ['ad_id','campaign_id','post_id','utm_source','utm_campaign','utm_content']) {
    const v = sp[k];
    if (typeof v === 'string') qs.append(k, v);
    else if (Array.isArray(v)) v.forEach(val => qs.append(k, val));
  }

  const base = process.env.NEXT_PUBLIC_API_URL; // <-- make sure .env.local sets this
  if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set');

  const res = await fetch(`${base}/api/variants/resolve?${qs.toString()}`, { cache: 'no-store' });
  if (!res.ok) return { heroVariant: null, campaignId: null };
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>; // async on your Next version
}) {
  const sp = await searchParams;                         // <-- await it
  const { heroVariant, campaignId } = await getVariant(sp);

  return (
    <main>
      <GeoTracker />
      <HeroLoader initialVariant={heroVariant} campaignId={campaignId} />
      <WhyOptimizeLoader campaignId={campaignId} />
    </main>
  );
}
