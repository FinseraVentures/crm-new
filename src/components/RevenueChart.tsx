import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
];

// Weekly mock: last 7 weeks
const weeklyData = [
  { name: "W-6", revenue: 1200 },
  { name: "W-5", revenue: 2200 },
  { name: "W-4", revenue: 1800 },
  { name: "W-3", revenue: 2600 },
  { name: "W-2", revenue: 3000 },
  { name: "W-1", revenue: 3500 },
  { name: "This W", revenue: 4000 },
];

// Daily mock: last 7 days
const dailyData = [
  { name: "Mon", revenue: 400 },
  { name: "Tue", revenue: 600 },
  { name: "Wed", revenue: 550 },
  { name: "Thu", revenue: 700 },
  { name: "Fri", revenue: 900 },
  { name: "Sat", revenue: 800 },
  { name: "Sun", revenue: 1000 },
];

export function RevenueChart() {
  const [range, setRange] = useState<"day" | "week" | "month">("month");

  const data = useMemo(() => {
    switch (range) {
      case "day":
        return dailyData;
      case "week":
        return weeklyData;
      default:
        return monthlyData;
    }
  }, [range]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 gap-2 md:gap-0">
        <CardTitle className="text-base md:text-lg font-semibold">Revenue Over Time</CardTitle>
        <Tabs value={range} onValueChange={(v) => setRange(v as any)} className="w-auto">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
