import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dayData = [
  { name: "12 AM", bookings: 2 },
  { name: "4 AM", bookings: 1 },
  { name: "8 AM", bookings: 8 },
  { name: "12 PM", bookings: 15 },
  { name: "4 PM", bookings: 12 },
  { name: "8 PM", bookings: 6 },
];

const weekData = [
  { name: "Mon", bookings: 12 },
  { name: "Tue", bookings: 19 },
  { name: "Wed", bookings: 15 },
  { name: "Thu", bookings: 25 },
  { name: "Fri", bookings: 22 },
  { name: "Sat", bookings: 18 },
  { name: "Sun", bookings: 10 },
];

const monthData = [
  { name: "Week 1", bookings: 45 },
  { name: "Week 2", bookings: 62 },
  { name: "Week 3", bookings: 58 },
  { name: "Week 4", bookings: 71 },
];

export function BookingsChart() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  const data = period === "day" ? dayData : period === "week" ? weekData : monthData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Bookings Breakdown</CardTitle>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as "day" | "week" | "month")} className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar
              dataKey="bookings"
              fill="hsl(var(--chart-2))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
