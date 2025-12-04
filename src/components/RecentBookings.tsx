import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bookings = [
  {
    id: 1,
    company: "Acme Corp",
    service: "Financial Audit",
    bdm: "John Smith",
    status: "completed",
    amount: "$12,500",
    date: "2024-01-15",
  },
  {
    id: 2,
    company: "TechStart Inc",
    service: "Tax Consultation",
    bdm: "Sarah Johnson",
    status: "in-process",
    amount: "$8,200",
    date: "2024-01-14",
  },
  {
    id: 3,
    company: "Global Industries",
    service: "Compliance Review",
    bdm: "Mike Chen",
    status: "pending",
    amount: "$15,800",
    date: "2024-01-13",
  },
  {
    id: 4,
    company: "StartupXYZ",
    service: "Business Registration",
    bdm: "Emily Davis",
    status: "completed",
    amount: "$5,500",
    date: "2024-01-12",
  },
  {
    id: 5,
    company: "Enterprise Solutions",
    service: "Annual Filing",
    bdm: "John Smith",
    status: "cancelled",
    amount: "$9,900",
    date: "2024-01-11",
  },
];

const statusConfig = {
  completed: { label: "Completed", variant: "default" as const, className: "bg-success hover:bg-success" },
  "in-process": { label: "In Process", variant: "default" as const, className: "bg-warning hover:bg-warning" },
  pending: { label: "Pending", variant: "default" as const, className: "bg-info hover:bg-info" },
  cancelled: { label: "Cancelled", variant: "destructive" as const, className: "" },
};

export function RecentBookings() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <CardTitle className="text-base md:text-lg font-semibold">Recent Bookings</CardTitle>
        <Button
          onClick={() => navigate("/dashboard/new-booking")}
          className="flex items-center gap-2 w-full sm:w-auto text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          New Booking
        </Button>
      </CardHeader>
      <CardContent className="p-2 md:p-6">
        <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[120px]">Company</TableHead>
              <TableHead className="hidden md:table-cell max-w-[130px]">Service</TableHead>
              <TableHead className="hidden lg:table-cell max-w-[110px]">BDM</TableHead>
              <TableHead className="max-w-[90px]">Status</TableHead>
              <TableHead className="hidden sm:table-cell max-w-[90px]">Amount</TableHead>
              <TableHead className="hidden md:table-cell max-w-[90px]">Date</TableHead>
              <TableHead className="text-right max-w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium text-xs md:text-sm truncate max-w-[120px]">{booking.company}</TableCell>
                <TableCell className="hidden md:table-cell text-xs md:text-sm truncate max-w-[130px]">{booking.service}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs md:text-sm truncate max-w-[110px]">{booking.bdm}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      statusConfig[booking.status as keyof typeof statusConfig]
                        .variant
                    }
                    className={
                      statusConfig[booking.status as keyof typeof statusConfig]
                        .className + " text-xs"
                    }
                  >
                    {
                      statusConfig[booking.status as keyof typeof statusConfig]
                        .label
                    }
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell font-semibold text-xs md:text-sm">
                  {booking.amount}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs md:text-sm">
                  {booking.date}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive text-xs">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
