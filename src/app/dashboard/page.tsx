// src\app\dashboard\page.tsx
import dynamic from "next/dynamic";
import VariantPerformanceTable from "@/components/VariantPerformanceTable";
import CountryPieChart from "@/components/CountryPieChart";
import VisitsByHourChart from "@/components/VisitsByHourChart";
import DevicePieChart from "@/components/DeviceTypePieChart";
import BrowserPieChart from "@/components/BrowserPieChart";
import VisitsOverTimeChart from "@/components/VisitsOverTimeChart";
import EventFunnelChart from "@/components/EventFunnelChart";

// ✅ Dynamically import UserClusterMap to disable SSR
const UserClusterMap = dynamic(() => import("@/components/UserClusterMap"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Landing Page Analytics Dashboard
      </h1>
      <VariantPerformanceTable />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <CountryPieChart />
        <VisitsByHourChart />
        <DevicePieChart />
        <BrowserPieChart />
        <VisitsOverTimeChart />
        <EventFunnelChart />
        <UserClusterMap />
      </div>
    </div>
  );
}
