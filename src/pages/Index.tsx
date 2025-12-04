import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingsChart } from "@/components/BookingsChart";
import { RecentBookings } from "@/components/RecentBookings";
import { TrendingUp, Users, IndianRupee, BookOpen } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search dashboard..."
    >
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
        <KPICard
          title="Total Bookings"
          value="1,284"
          trend="+12% vs last month"
          trendUp
          icon={BookOpen}
          sparklineColor="bg-chart-3"
        />
        <KPICard
          title="Total Users"
          value="328"
          trend="+8% vs last month"
          trendUp
          icon={Users}
          sparklineColor="bg-chart-2"
        />
        <KPICard
          title="Monthly Revenue"
          value="₹84,420"
          trend="+18% vs last month"
          trendUp
          icon={TrendingUp}
          sparklineColor="bg-chart-3"
        />
        <KPICard
          title="Today's Revenue"
          value="₹3,210"
          trend="+5% vs yesterday"
          trendUp
          icon={IndianRupee}
          sparklineColor="bg-chart-4"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-2 md:gap-4 lg:gap-6 lg:grid-cols-2">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* Recent Bookings Table */}
      <RecentBookings />
    </DashboardLayout>
  );
};

export default Index;
