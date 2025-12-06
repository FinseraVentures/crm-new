import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { DeleteBookingDialog } from "@/components/DeleteBookingDialog";
import { transformBookings } from "../lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MultiSelect, MultiSelectOption } from "@/components/MultiSelect";
import { Pagination } from "@/components/Pagination";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  Copy,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import  { API_ENDPOINTS, getApiUrl } from "@/config/env";
import apiClient from "@/lib/apiClient";

const servicesOptions: MultiSelectOption[] = [
  { label: "MSME", value: "msme" },
  { label: "GST", value: "gst" },
  { label: "PMEGP", value: "pmegp" },
  { label: "Startup Certificate", value: "startup-certificate" },
  { label: "Loan", value: "loan" },
  { label: "Accounting", value: "accounting" },
  { label: "Tax Filing", value: "tax-filing" },
];

const paymentModes = ["All", "UPI", "Cash", "Bank Transfer", "Cheque", "Card"];
const statuses = ["All", "New", "In Process", "Completed", "Cancelled"];

const ITEMS_PER_PAGE = 10;

interface Booking {
  id: string;
  bookingDate: string;
  paymentDate: string;
  companyName: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  service: string;
  term: string;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  paymentMode: string;
  status: string;
  bdmName: string;
  closeBy: string;
  state: string;
  afterFundDisbursement: string;
  notes: string;
}

// Mock booking data
const initialBookings: Booking[] = [
  {
    id: "BK001",
    bookingDate: "2024-01-15",
    paymentDate: "2024-01-20",
    companyName: "Tech Solutions Pvt Ltd",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@techsolutions.com",
    contactNumber: "+91 98765 43210",
    service: "MSME, GST",
    term: "Yearly",
    totalAmount: 50000,
    receivedAmount: 30000,
    pendingAmount: 20000,
    paymentMode: "UPI",
    status: "In Process",
    bdmName: "Amit Sharma",
    closeBy: "Ravi Verma",
    state: "Maharashtra",
    afterFundDisbursement: "Yes",
    notes: "Follow up required for pending payment",
  },
  {
    id: "BK003",
    bookingDate: "2024-01-18",
    paymentDate: "2024-01-25",
    companyName: "Innovate Hub",
    contactPerson: "Vikram Mehta",
    email: "vikram@innovatehub.com",
    contactNumber: "+91 76543 21098",
    service: "Startup Certificate",
    term: "Monthly",
    totalAmount: 25000,
    receivedAmount: 0,
    pendingAmount: 25000,
    paymentMode: "Cash",
    status: "New",
    bdmName: "Amit Sharma",
    closeBy: "Sarah Khan",
    state: "Delhi",
    afterFundDisbursement: "N/A",
    notes: "New booking, awaiting initial payment",
  }
];

const AllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dateType, setDateType] = useState<string>("booking-date");
  const [status, setStatus] = useState<string>("all");
  const [paymentMode, setPaymentMode] = useState<string>("all");
  const [bdmSearch, setBdmSearch] = useState<string>("");
  const [companySearch, setCompanySearch] = useState<string>("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(initialBookings);
  const [headerSearch, setHeaderSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const role = localStorage.getItem("userRole") || "user";
  const userId = localStorage.getItem("userId") || "";
    // Filter by header search
  const searchedBookings = headerSearch.trim() 
    ? filteredBookings.filter((booking) =>
        booking.companyName.toLowerCase().includes(headerSearch.toLowerCase()) ||
        booking.id.toLowerCase().includes(headerSearch.toLowerCase()) ||
        booking.contactPerson.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : filteredBookings;

  // Calculate pagination
  const totalPages = Math.ceil(searchedBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedBookings = searchedBookings.slice(startIndex, endIndex);
  
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  //getting bookings from api
useEffect(() => {
  const fetchData = async () => {
    try {
      const url =
        role === "admin"
          ? getApiUrl(API_ENDPOINTS.BOOKINGS.GET_ALL)
          : getApiUrl(API_ENDPOINTS.BOOKINGS.GET_BY_USER(userId));

      const res = await apiClient.get(url);

      const raw =
        res.data?.bookings ||
        res.data?.data ||
        res.data?.Allbookings ||
        res.data ||
        [];
      const data = Array.isArray(raw) ? raw : [];

      const frontendBookings: Booking[] = transformBookings(data);

      setBookings(frontendBookings);
      setFilteredBookings(frontendBookings);
    } catch (error: any) {
      console.error(
        "Failed to load bookings:",
        error.response?.data || error.message
      );
    }
  };

  fetchData();
}, []);

  
  // Edit dialog state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Delete dialog state
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "In Process":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "Cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "New":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Booking ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearch = () => {
    let filtered = [...bookings];

    // Filter by date range
    if (fromDate || toDate) {
      filtered = filtered.filter((booking) => {
        const bookingDateStr = dateType === "booking-date" ? booking.bookingDate : booking.paymentDate;
        const bookingDate = new Date(bookingDateStr);
        
        if (fromDate && toDate) {
          return bookingDate >= fromDate && bookingDate <= toDate;
        } else if (fromDate) {
          return bookingDate >= fromDate;
        } else if (toDate) {
          return bookingDate <= toDate;
        }
        return true;
      });
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((booking) => 
        booking.status.toLowerCase().replace(/\s+/g, "-") === status
      );
    }

    // Filter by payment mode
    if (paymentMode !== "all") {
      filtered = filtered.filter((booking) => 
        booking.paymentMode.toLowerCase().replace(/\s+/g, "-") === paymentMode
      );
    }

    // Filter by services
    if (selectedServices.length > 0) {
      filtered = filtered.filter((booking) => {
        const bookingServices = booking.service.toLowerCase().split(", ");
        return selectedServices.some((service) => 
          bookingServices.some((bs) => bs.includes(service))
        );
      });
    }

    // Filter by BDM search
    if (bdmSearch.trim()) {
      filtered = filtered.filter((booking) =>
        booking.bdmName.toLowerCase().includes(bdmSearch.toLowerCase())
      );
    }

    // Filter by company/booking ID search
    if (companySearch.trim()) {
      filtered = filtered.filter((booking) =>
        booking.companyName.toLowerCase().includes(companySearch.toLowerCase()) ||
        booking.id.toLowerCase().includes(companySearch.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
    toast.success(`Found ${filtered.length} booking${filtered.length !== 1 ? 's' : ''}`);
  };

  const handleReset = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedServices([]);
    setDateType("booking-date");
    setStatus("all");
    setPaymentMode("all");
    setBdmSearch("");
    setCompanySearch("");
    setFilteredBookings(bookings);
    setCurrentPage(1);
    toast.info("Filters reset");
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedBooking: Booking) => {
    const updatedBookings = bookings.map((b) =>
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setBookings(updatedBookings);
    
    // Re-apply filters
    const updatedFiltered = filteredBookings.map((b) =>
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setFilteredBookings(updatedFiltered);
  };

  const handleDeleteClick = (booking: Booking) => {
    setDeletingBookingId(booking.id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingBookingId) {
      const updatedBookings = bookings.filter((b) => b.id !== deletingBookingId);
      setBookings(updatedBookings);
      
      const updatedFiltered = filteredBookings.filter((b) => b.id !== deletingBookingId);
      setFilteredBookings(updatedFiltered);
      
      toast.success(`Booking ${deletingBookingId} deleted successfully`);
      setDeletingBookingId(null);
    }
  };

  return (
    <DashboardLayout
      searchQuery={headerSearch}
      onSearchChange={setHeaderSearch}
      searchPlaceholder="Search bookings by company, ID, or person..."
    >
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "All Bookings" },
          ]}
        />

        {/* Page Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            All Bookings
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            View, filter and manage all bookings.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 z-20 mb-6 bg-card/90 backdrop-blur border rounded-2xl p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-type">Filter By</Label>
              <Select value={dateType} onValueChange={setDateType}>
                <SelectTrigger id="date-type" className="bg-background">
                  <SelectValue placeholder="Select date type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking-date">Booking Date</SelectItem>
                  <SelectItem value="payment-date">Payment Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="from-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      format(fromDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="to-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="bg-background">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((statusOption) => (
                    <SelectItem
                      key={statusOption}
                      value={statusOption.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {statusOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment-mode">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger id="payment-mode" className="bg-background">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem
                      key={mode}
                      value={mode.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <MultiSelect
                options={servicesOptions}
                selected={selectedServices}
                onChange={setSelectedServices}
                placeholder="Select services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bdm-search">BDM Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bdm-search"
                  value={bdmSearch}
                  onChange={(e) => setBdmSearch(e.target.value)}
                  placeholder="Search by BDM name..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-search">Company / Booking ID</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-search"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Search by company name or booking ID..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Bookings Grid */}
        {searchedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No bookings found matching your filters.
            </p>
            <Button variant="ghost" onClick={handleReset} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                {/* Header with actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-foreground truncate">
                      {booking.companyName}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      ID: {booking.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(booking.id)}
                      className="h-8 w-8"
                    >
                      {copiedId === booking.id ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(booking)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(booking)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <Badge className={cn("border", getStatusColor(booking.status))}>
                  {booking.status}
                </Badge>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Booking Date</p>
                    <p className="font-medium text-foreground">
                      {booking.bookingDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Date</p>
                    <p className="font-medium text-foreground">
                      {booking.paymentDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Person</p>
                    <p className="font-medium text-foreground">
                      {booking.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Number</p>
                    <p className="font-medium text-foreground">
                      {booking.contactNumber}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      {booking.email}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-medium text-foreground">
                      {booking.service}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Term</p>
                    <p className="font-medium text-foreground">
                      {booking.term}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Mode</p>
                    <p className="font-medium text-foreground">
                      {booking.paymentMode}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-foreground">
                      ₹{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Received Amount</p>
                    <p className="font-semibold text-success">
                      ₹{booking.receivedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending Amount</p>
                    <p
                      className={cn(
                        "font-semibold",
                        booking.pendingAmount > 0
                          ? "text-destructive"
                          : "text-success"
                      )}
                    >
                      ₹{booking.pendingAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">BDM</p>
                    <p className="font-medium text-foreground">
                      {booking.bdmName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Close By</p>
                    <p className="font-medium text-foreground">
                      {booking.closeBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">State</p>
                    <p className="font-medium text-foreground">
                      {booking.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      After Fund Disbursement
                    </p>
                    <p className="font-medium text-foreground">
                      {booking.afterFundDisbursement}
                    </p>
                  </div>
                  {booking.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Notes</p>
                      <p className="font-medium text-foreground text-sm">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={searchedBookings.length}
              itemName="booking"
            />
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <EditBookingDialog
        booking={editingBooking}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      {/* Delete Dialog */}
      <DeleteBookingDialog
        bookingId={deletingBookingId}
        companyName={
          bookings.find((b) => b.id === deletingBookingId)?.companyName || ""
        }
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
};

export default AllBookings;
