import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  ExternalLink,
  Mail,
  Phone,
  User,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const presetAmounts = [11800, 17700, 23600, 29500, 35400, 47200];
const ITEMS_PER_PAGE = 10;

type PaymentStatus = "pending" | "completed" | "cancelled";

interface PaymentLink {
  id: string;
  customerName: string;
  contact: string;
  amount: number;
  description: string;
  createdOn: string;
  link: string;
  status: PaymentStatus;
}

const mockPaymentLinks: PaymentLink[] = [
  {
    id: "PL001",
    customerName: "Rajesh Kumar",
    contact: "+91 98765 43210",
    amount: 23600,
    description: "GST Registration Service",
    createdOn: "2024-01-15 10:30 AM",
    link: "https://rzp.io/l/abc123",
    status: "completed",
  },
  {
    "id": "PL002",
    "customerName": "Neha Sharma",
    "contact": "+91 98230 44567",
    "amount": 17700,
    "description": "MSME Registration",
    "createdOn": "2024-01-18 02:15 PM",
    "link": "https://rzp.io/l/msme002",
    "status": "pending"
  },
  {
    "id": "PL003",
    "customerName": "Amit Patel",
    "contact": "amit.patel@example.com",
    "amount": 35400,
    "description": "Startup India Certificate",
    "createdOn": "2024-01-20 09:10 AM",
    "link": "https://rzp.io/l/startup003",
    "status": "completed"
  },
  {
    "id": "PL004",
    "customerName": "Simran Kaur",
    "contact": "+91 90012 33445",
    "amount": 29500,
    "description": "GST + MSME Combo",
    "createdOn": "2024-02-01 11:45 AM",
    "link": "https://rzp.io/l/combo004",
    "status": "cancelled"
  },
  {
    "id": "PL005",
    "customerName": "Rohan Mehta",
    "contact": "rohan.mehta@example.com",
    "amount": 11800,
    "description": "GST Filing Monthly",
    "createdOn": "2024-02-05 04:20 PM",
    "link": "https://rzp.io/l/gst005",
    "status": "pending"
  },
  {
    "id": "PL006",
    "customerName": "Pooja Verma",
    "contact": "+91 93450 88991",
    "amount": 47200,
    "description": "Trademark Registration",
    "createdOn": "2024-02-10 01:05 PM",
    "link": "https://rzp.io/l/tm006",
    "status": "completed"
  },
  {
    "id": "PL007",
    "customerName": "Sagar Dhawan",
    "contact": "+91 99876 11223",
    "amount": 23600,
    "description": "ISO Certification Advance",
    "createdOn": "2024-02-12 10:00 AM",
    "link": "https://rzp.io/l/iso007",
    "status": "pending"
  },
  {
    "id": "PL008",
    "customerName": "Deepika Nair",
    "contact": "deepika.nair@example.com",
    "amount": 35400,
    "description": "Company Incorporation",
    "createdOn": "2024-02-14 03:30 PM",
    "link": "https://rzp.io/l/inc008",
    "status": "completed"
  },
  {
    "id": "PL009",
    "customerName": "Vikas Taneja",
    "contact": "+91 91234 55667",
    "amount": 29500,
    "description": "GST Annual Plan",
    "createdOn": "2024-02-18 09:50 AM",
    "link": "https://rzp.io/l/gstannual009",
    "status": "cancelled"
  },
  {
    "id": "PL010",
    "customerName": "Harshita Kapoor",
    "contact": "harshita.kapoor@example.com",
    "amount": 17700,
    "description": "Professional Tax Registration",
    "createdOn": "2024-02-22 12:40 PM",
    "link": "https://rzp.io/l/ptax010",
    "status": "completed"
  },
  {
    "id": "PL011",
    "customerName": "Nitin Bansal",
    "contact": "+91 98980 70012",
    "amount": 11800,
    "description": "GST Certificate Update",
    "createdOn": "2024-02-25 05:25 PM",
    "link": "https://rzp.io/l/update011",
    "status": "pending"
  },
  {
    id: "PL002",
    customerName: "Priya Sharma",
    contact: "priya@example.com",
    amount: 17700,
    description: "MSME Registration",
    createdOn: "2024-01-16 02:15 PM",
    link: "https://rzp.io/l/def456",
    status: "pending",
  },
  {
    id: "PL003",
    customerName: "Amit Patel",
    contact: "+91 91234 56789",
    amount: 35400,
    description: "Startup India Certificate",
    createdOn: "2024-01-17 09:45 AM",
    link: "https://rzp.io/l/ghi789",
    status: "pending",
  },
];

const PaymentLinkPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(mockPaymentLinks);
  const [headerSearch, setHeaderSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const displayedLinks = headerSearch.trim()
    ? paymentLinks.filter(
        (link) =>
          link.customerName
            .toLowerCase()
            .includes(headerSearch.toLowerCase()) ||
          link.contact.toLowerCase().includes(headerSearch.toLowerCase()) ||
          link.description.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : paymentLinks;

  // Pagination logic
  const totalPages = Math.ceil(displayedLinks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLinks = displayedLinks.slice(startIndex, endIndex);

  const handleAmountClick = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Payment link created successfully!");
    // TODO: handle API + reset if needed
  };

  const handleStatusChange = (id: string, newStatus: PaymentStatus) => {
    setPaymentLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, status: newStatus } : link
      )
    );
    toast.success("Payment status updated!");
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Payment link copied to clipboard!");
  };

  const getStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "pending":
        return "bg-red-100 text-red-600 hover:bg-red-100";
      case "cancelled":
        return "bg-red-200 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout
      searchQuery={headerSearch}
      onSearchChange={setHeaderSearch}
      searchPlaceholder="Search payment links by customer, contact, or description..."
    >
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Payment Link" },
          ]}
        />

        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            Payment Link
          </h1>
          <p className="text-xs md:text-base text-muted-foreground">
            Create new Razorpay payment links and manage existing ones.
          </p>
        </div>

        {/* Create Payment Link Section */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
          {/* Razorpay Icon & Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-[100px] md:w-[150px] h-[70px] md:h-[100px] text-white mb-3 md:mb-4">
              <img src="/images/razorpay-icon.webp" alt="" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-lg md:text-2xl font-semibold text-foreground mb-1">
              Create Razorpay Link
            </h2>
            <p className="text-xs md:text-base text-muted-foreground">
              Generate a secure payment link for your client.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="fullname" className="text-xs md:text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
                  <Input
                    id="fullname"
                    placeholder="Full Name"
                    className="pl-10 bg-background text-xs md:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 bg-background text-xs md:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="phone" className="text-xs md:text-sm">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="pl-10 bg-background text-xs md:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="amount" className="text-xs md:text-sm">Amount (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    className="pl-10 bg-background text-xs md:text-sm"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preset Amount Pills */}
            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Quick Amount Selection</Label>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={selectedAmount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountClick(preset)}
                    className={cn(
                      "rounded-full transition-all text-xs",
                      selectedAmount === preset &&
                        "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    ₹{preset.toLocaleString("en-IN")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="description" className="text-xs md:text-sm">Description*</Label>
              <Textarea
                id="description"
                placeholder="Add payment description or reference…"
                className="min-h-20 md:min-h-24 bg-background resize-none text-xs md:text-sm"
                required
              />
            </div>

            {/* Notification Options */}
            <div className="space-y-2 md:space-y-3">
              <Label className="text-xs md:text-sm">Notification Options</Label>
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-notification"
                    checked={sendEmail}
                    onCheckedChange={(checked) =>
                      setSendEmail(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="email-notification"
                    className="text-xs md:text-sm font-normal cursor-pointer"
                  >
                    Send email notification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms-notification"
                    checked={sendSMS}
                    onCheckedChange={(checked) =>
                      setSendSMS(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="sms-notification"
                    className="text-xs md:text-sm font-normal cursor-pointer"
                  >
                    Send SMS notification
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm"
            >
              Create Payment Link
            </Button>
          </form>
        </div>

        {/* Previous Payment Links Section */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-semibold text-foreground mb-1 md:mb-2">
              Previous Payment Links
            </h2>
            <p className="text-xs md:text-base text-muted-foreground">
              Quickly access and update existing payment links.
            </p>
          </div>

          {/* Mobile: stacked cards to avoid horizontal scroll */}
          <div className="md:hidden space-y-3 -mx-4 px-4">
            {paginatedLinks.map((link) => (
              <div
                key={link.id}
                className="bg-card border border-border rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{link.customerName}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">₹{link.amount.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-muted-foreground text-xs truncate">{link.contact}</div>
                    <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{link.description}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => copyLink(link.link)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => window.open(link.link, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Badge className={cn("capitalize text-xs", getStatusBadgeClass(link.status))}>
                      {link.status}
                    </Badge>
                  </div>

                  <div className="flex-shrink-0">
                    <Select
                      value={link.status}
                      onValueChange={(value) =>
                        handleStatusChange(link.id, value as PaymentStatus)
                      }
                    >
                      <SelectTrigger className="w-auto h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <Table className="text-xs md:text-sm min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Description</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Created On</TableHead>
                  <TableHead className="text-xs">Link</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs md:text-sm max-w-[220px] lg:max-w-[320px]">
                      <div className="truncate">{link.customerName}</div>
                      <div className="text-muted-foreground text-xs md:hidden truncate">{link.contact.substring(0, 20)}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-xs max-w-[200px]">
                      <div className="truncate">{link.contact}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-xs md:text-sm whitespace-nowrap pr-2">
                      ₹{link.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs max-w-[360px] break-words">
                      <div className="">{link.description}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[140px] truncate">
                      {link.createdOn}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5 md:gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 md:h-8 md:w-8"
                          onClick={() => copyLink(link.link)}
                        >
                          <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 md:h-8 md:w-8 hidden md:flex"
                          onClick={() => window.open(link.link, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "capitalize text-xs",
                          getStatusBadgeClass(link.status)
                        )}
                      >
                        {link.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={link.status}
                        onValueChange={(value) =>
                          handleStatusChange(link.id, value as PaymentStatus)
                        }
                      >
                        <SelectTrigger className="w-auto max-w-[120px] md:max-w-[160px] h-7 md:h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {displayedLinks.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={displayedLinks.length}
                itemName="payment link"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentLinkPage;
