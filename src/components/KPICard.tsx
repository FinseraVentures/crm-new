import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  sparklineColor?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendUp = true,
  icon: Icon,
  sparklineColor = "bg-primary",
}: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", sparklineColor, "bg-opacity-10")}>
              <Icon className={cn("h-5 w-5", sparklineColor.replace("bg-", "text-"))} />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trend}
            </p>
          )}
        </div>

        {/* Mini sparkline visualization */}
        <div className="mt-4 flex items-end gap-1 h-8">
          {[40, 60, 45, 80, 55, 90, 70].map((height, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-sm", sparklineColor, "bg-opacity-20")}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
