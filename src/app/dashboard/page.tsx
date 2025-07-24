// src/app/dashboard/page.tsx
import VariantPerformanceTable from "@/components/VariantPerformanceTable";
import CountryPieChart from "@/components/CountryPieChart";
import VisitsByHourChart from "@/components/VisitsByHourChart";
// import DevicePieChart from "@/components/DevicePieChart"; // If you build it

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Landing Page Analytics Dashboard</h1>
      <VariantPerformanceTable />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <CountryPieChart />
        <VisitsByHourChart />
        {/* <DevicePieChart /> */}
      </div>
    </div>
  );
}
