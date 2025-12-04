import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/Pagination";
import { RotateCcw, Trash2, Clock, User, Trash as TrashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

interface DeletedBooking {
  id: string;
  bookingName: string;
  email: string;
  deletedAt: string;
  deletedBy: string;
  reason?: string;
  bookingId: string;
}

const mockDeletedBookings: DeletedBooking[] = [
  {
    id: "1",
    bookingName: "Finsera Ventures Private Limited",
    email: "contact@finsera.com",
    deletedAt: "2025-01-15 14:30",
    deletedBy: "Rajesh Kumar",
    reason: "Duplicate entry found",
    bookingId: "BK-2025-001",
  },
  {
    id: "2",
    bookingName: "Tech Solutions India Pvt Ltd",
    email: "info@techsolutions.in",
    deletedAt: "2025-01-14 10:15",
    deletedBy: "Priya Sharma",
    bookingId: "BK-2025-002",
  },{
    "id": "3",
    "bookingName": "Global Fintech Services",
    "email": "contact@globalfintech.com",
    "deletedAt": "2025-01-12 16:45",
    "deletedBy": "Amit Patel",
    "bookingId": "BK-2025-003"
  },
  {
    "id": "4",
    "bookingName": "Skyline Infra Developers",
    "email": "support@skylineinfra.com",
    "deletedAt": "2025-01-18 11:20",
    "deletedBy": "Ravi Verma",
    "bookingId": "BK-2025-004"
  },
  {
    "id": "5",
    "bookingName": "Brightway Traders LLP",
    "email": "hello@brightwaytraders.com",
    "deletedAt": "2025-01-10 09:50",
    "deletedBy": "Neha Mehta",
    "bookingId": "BK-2025-005"
  },
  {
    "id": "6",
    "bookingName": "NextGen Marketing Solutions",
    "email": "info@nextgenms.com",
    "deletedAt": "2025-01-09 14:10",
    "deletedBy": "Vikas Taneja",
    "bookingId": "BK-2025-006"
  },
  {
    "id": "7",
    "bookingName": "Metro Logistics Pvt Ltd",
    "email": "contact@metrologistics.in",
    "deletedAt": "2025-01-17 12:30",
    "deletedBy": "Simran Kaur",
    "bookingId": "BK-2025-007"
  },
  {
    "id": "8",
    "bookingName": "Alpha Tech Innovations",
    "email": "hello@alphatech.co.in",
    "deletedAt": "2025-01-11 18:25",
    "deletedBy": "Harshita Mehta",
    "bookingId": "BK-2025-008"
  },
  {
    "id": "9",
    "bookingName": "Zenith Corporate Advisors",
    "email": "advisors@zenithcorp.com",
    "deletedAt": "2025-01-13 15:40",
    "deletedBy": "Aman Gupta",
    "bookingId": "BK-2025-009"
  },
  {
    "id": "10",
    "bookingName": "Horizon Steel Industries",
    "email": "sales@horizonsteel.in",
    "deletedAt": "2025-01-08 17:05",
    "deletedBy": "Rakesh Nair",
    "bookingId": "BK-2025-010"
  },
  {
    "id": "11",
    "bookingName": "Evergreen Financial Consultants",
    "email": "support@evergreenfc.com",
    "deletedAt": "2025-01-19 08:45",
    "deletedBy": "Priya Singh",
    "bookingId": "BK-2025-011"
  },
  {
    "id": "12",
    "bookingName": "BlueOcean Technologies",
    "email": "contact@blueocean.in",
    "deletedAt": "2025-01-16 13:55",
    "deletedBy": "Sagar Khanna",
    "bookingId": "BK-2025-012"
  },
  {
    id: "3",
    bookingName: "Global Fintech Services",
    email: "hello@globalfintech.com",
    deletedAt: "2025-01-12 16:45",
    deletedBy: "Amit Patel",
    reason: "Client requested cancellation",
    bookingId: "BK-2025-003",
  },
];

const Trash = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deletedBookings, setDeletedBookings] = useState<DeletedBooking[]>(mockDeletedBookings);
  const [filterBy, setFilterBy] = useState("all");
  const { toast } = useToast();
  const [headerSearch, setHeaderSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleRestore = (id: string, name: string) => {
    setDeletedBookings((prev) => prev.filter((booking) => booking.id !== id));
    toast({
      title: "Booking Restored",
      description: `${name} has been restored successfully.`,
    });
  };

  const handlePermanentDelete = (id: string, name: string) => {
    setDeletedBookings((prev) => prev.filter((booking) => booking.id !== id));
    toast({
      title: "Permanently Deleted",
      description: `${name} has been permanently deleted.`,
      variant: "destructive",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filterBookings = (bookings: DeletedBooking[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = bookings.filter((booking) => {
      const deletedDate = new Date(booking.deletedAt);

      switch (filterBy) {
        case "today": {
          const bookingDate = new Date(
            deletedDate.getFullYear(),
            deletedDate.getMonth(),
            deletedDate.getDate()
          );
          return bookingDate.getTime() === today.getTime();
        }
        case "week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return deletedDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);
          return deletedDate >= monthAgo;
        }
        case "all":
        default:
          return true;
      }
    });
       // Apply header search
   if (headerSearch.trim()) {
     filtered = filtered.filter((booking) =>
       booking.bookingName.toLowerCase().includes(headerSearch.toLowerCase()) ||
       booking.email.toLowerCase().includes(headerSearch.toLowerCase()) ||
       booking.bookingId.toLowerCase().includes(headerSearch.toLowerCase()) ||
       booking.deletedBy.toLowerCase().includes(headerSearch.toLowerCase())
     );
  }
   
    return filtered;
  };

  const filteredBookings = filterBookings(deletedBookings);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  return (
    <DashboardLayout searchQuery={headerSearch}
   onSearchChange={setHeaderSearch}
    searchPlaceholder="Search trash by booking name, email, ID, or deleted by...">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Trashed Bookings" },
          ]}
        />

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            Trashed Bookings
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            View, restore, or permanently delete removed bookings.
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs md:text-sm font-medium text-foreground">
            Filter by:
          </span>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="today">Deleted Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Booking Cards or Empty State */}
        {filteredBookings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="rounded-full bg-muted p-6">
                <TrashIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  No Trashed Bookings
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md">
                  {filterBy === "all"
                    ? "Deleted items will appear here for 30 days before permanent removal."
                    : "No bookings found for the selected time period."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-1">
              {paginatedBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  {/* Header with Name and Email */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate max-w-[60%] sm:max-w-none">
                        {booking.bookingName}
                      </h3>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {booking.bookingId}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {booking.email}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Deleted: {booking.deletedAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>By: {booking.deletedBy}</span>
                    </div>
                  </div>

                  {/* Reason Box */}
                  {booking.reason && (
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Reason:
                        </span>{" "}
                        {booking.reason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                      onClick={() =>
                        handleRestore(booking.id, booking.bookingName)
                      }
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() =>
                        handlePermanentDelete(booking.id, booking.bookingName)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={filteredBookings.length}
                itemName="booking"
              />
            </div>

            {/* Info Banner */}
            {filteredBookings.length > 0 && (
              <Card className="bg-muted/50 border-border mt-6">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Items in trash will be permanently deleted after 30 days
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Trash;
