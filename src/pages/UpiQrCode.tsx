import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Copy, Download, QrCode, User, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const presetAmounts = [11800, 17700, 23600, 29500, 35400, 47200];
const ITEMS_PER_PAGE = 10;

type QRStatus = "active" | "used" | "expired";
type UsageType = "single" | "multiple" | "time-bound";

interface UpiQRCode {
  id: string;
  name: string;
  amount: number;
  purpose: string;
  description: string;
  usageType: UsageType;
  createdOn: string;
  expiresIn: string;
  status: QRStatus;
  qrUrl: string;
}

const mockQRCodes: UpiQRCode[] = [
  {
    id: "QR001",
    name: "Rajesh Kumar",
    amount: 23600,
    purpose: "GST Registration",
    description: "GST Registration Service Fee",
    usageType: "single",
    createdOn: "2024-01-15 10:30 AM",
    expiresIn: "12 hours",
    status: "active",
    qrUrl: "https://qr.razorpay.com/abc123",
  },
   {
    "id": "QR002",
    "name": "Neha Sharma",
    "amount": 17700,
    "purpose": "MSME Registration",
    "description": "MSME Certificate Processing Fee",
    "usageType": "multiple",
    "createdOn": "2024-01-18 02:20 PM",
    "expiresIn": "24 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/msme002"
  },
  {
    "id": "QR003",
    "name": "Amit Patel",
    "amount": 35400,
    "purpose": "Startup India Application",
    "description": "Startup India Portal Registration",
    "usageType": "single",
    "createdOn": "2024-01-20 09:10 AM",
    "expiresIn": "Expired",
    "status": "expired",
    "qrUrl": "https://qr.razorpay.com/startup003"
  },
  {
    "id": "QR004",
    "name": "Simran Kaur",
    "amount": 29500,
    "purpose": "GST + MSME Combo",
    "description": "Combo Fee for MSME & GST",
    "usageType": "time-bound",
    "createdOn": "2024-02-01 11:45 AM",
    "expiresIn": "6 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/combo004"
  },
  {
    "id": "QR005",
    "name": "Rohan Mehta",
    "amount": 11800,
    "purpose": "GST Filing",
    "description": "Monthly GST Filing Charges",
    "usageType": "single",
    "createdOn": "2024-02-05 04:20 PM",
    "expiresIn": "3 hours",
    "status": "used",
    "qrUrl": "https://qr.razorpay.com/gst005"
  },
  {
    "id": "QR006",
    "name": "Pooja Verma",
    "amount": 47200,
    "purpose": "Trademark Registration",
    "description": "Trademark Application Filing Fee",
    "usageType": "multiple",
    "createdOn": "2024-02-10 01:05 PM",
    "expiresIn": "24 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/tm006"
  },
  {
    "id": "QR007",
    "name": "Sagar Dhawan",
    "amount": 23600,
    "purpose": "ISO Certification",
    "description": "ISO Certification Processing Fee",
    "usageType": "time-bound",
    "createdOn": "2024-02-12 10:00 AM",
    "expiresIn": "18 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/iso007"
  },
  {
    "id": "QR008",
    "name": "Deepika Nair",
    "amount": 35400,
    "purpose": "Company Incorporation",
    "description": "Private Limited Company Registration",
    "usageType": "single",
    "createdOn": "2024-02-14 03:30 PM",
    "expiresIn": "Expired",
    "status": "expired",
    "qrUrl": "https://qr.razorpay.com/inc008"
  },
  {
    "id": "QR009",
    "name": "Vikas Taneja",
    "amount": 29500,
    "purpose": "GST Annual Plan",
    "description": "Annual GST Support Fee",
    "usageType": "multiple",
    "createdOn": "2024-02-18 09:50 AM",
    "expiresIn": "48 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/gstannual009"
  },
  {
    "id": "QR010",
    "name": "Harshita Kapoor",
    "amount": 17700,
    "purpose": "Professional Tax Registration",
    "description": "P Tax Registration Fee",
    "usageType": "single",
    "createdOn": "2024-02-22 12:40 PM",
    "expiresIn": "4 hours",
    "status": "used",
    "qrUrl": "https://qr.razorpay.com/ptax010"
  },
  {
    "id": "QR011",
    "name": "Nitin Bansal",
    "amount": 11800,
    "purpose": "GST Certificate Update",
    "description": "Amendment Fee for GST Certificate",
    "usageType": "single",
    "createdOn": "2024-02-25 05:25 PM",
    "expiresIn": "10 hours",
    "status": "active",
    "qrUrl": "https://qr.razorpay.com/update011"
  },
  {
    id: "QR002",
    name: "Priya Sharma",
    amount: 17700,
    purpose: "MSME Registration",
    description: "MSME Certificate Fee",
    usageType: "multiple",
    createdOn: "2024-01-16 02:15 PM",
    expiresIn: "Expired",
    status: "used",
    qrUrl: "https://qr.razorpay.com/def456",
  },
  {
    id: "QR003",
    name: "Amit Patel",
    amount: 35400,
    purpose: "Startup India",
    description: "Startup Certificate Application",
    usageType: "single",
    createdOn: "2024-01-17 09:45 AM",
    expiresIn: "2 hours",
    status: "expired",
    qrUrl: "https://qr.razorpay.com/ghi789",
  },
];

const UpiQrCode = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [fixedAmount, setFixedAmount] = useState(true);
  const [qrCodes] = useState<UpiQRCode[]>(mockQRCodes);
  const [headerSearch, setHeaderSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const displayedQRCodes = headerSearch.trim()
    ? qrCodes.filter((qr) =>
        qr.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
        qr.purpose.toLowerCase().includes(headerSearch.toLowerCase()) ||
        qr.description.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : qrCodes;

  // Pagination logic
  const totalPages = Math.ceil(displayedQRCodes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQRCodes = displayedQRCodes.slice(startIndex, endIndex);

  const handleAmountClick = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("UPI QR Code generated successfully!");
    // TODO: API + reset logic
  };

  const copyQRUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("QR URL copied to clipboard!");
  };

  const downloadQR = (id: string) => {
    toast.success(`Downloading QR code ${id}...`);
  };

  const viewQR = (url: string) => {
    window.open(url, "_blank");
  };

  const getStatusBadgeClass = (status: QRStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "used":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "expired":
        return "bg-gray-100 text-gray-600 hover:bg-gray-100";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout
      searchQuery={headerSearch}
      onSearchChange={setHeaderSearch}
      searchPlaceholder="Search QR codes by name, purpose, or description..."
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "UPI QR Code" },
          ]}
        />

        {/* Page header */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            UPI QR Code
          </h1>
          <p className="text-muted-foreground">
            Create new UPI QR codes and manage previously generated ones.
          </p>
        </div>

        {/* Create UPI QR Code Section */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center  w-[150px] text-white mb-4">
              <img src="/images/razorpay-icon.webp" alt="" />
            </div>
            <h2 className="text-lg md:text-2xl font-semibold text-foreground mb-1 md:mb-2">
              Create UPI QR Code
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Generate a secure UPI QR for instant payments.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Customer name"
                    className="pl-10 bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)*</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    className="pl-10 bg-background"
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
              <Label>Quick Amount Selection</Label>
              <div className="flex flex-wrap gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={selectedAmount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountClick(preset)}
                    className={cn(
                      "rounded-full transition-all",
                      selectedAmount === preset &&
                        "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    ₹{preset.toLocaleString("en-IN")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the payment purpose…"
                  className="min-h-20 bg-background resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose*</Label>
                <Input
                  id="purpose"
                  placeholder="Purpose of payment"
                  className="bg-background"
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID (Optional)</Label>
                <Input
                  id="customerId"
                  placeholder="Enter internal customer ID (optional)"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageType">Usage Type</Label>
                <Select defaultValue="single">
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Use</SelectItem>
                    <SelectItem value="multiple">Multiple Use</SelectItem>
                    <SelectItem value="time-bound">Time-bound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="closeBy">Close By (hours)</Label>
                <Input
                  id="closeBy"
                  type="number"
                  placeholder="Enter hours before expiry"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank for default 24 hours.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Payment Settings</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="fixed-amount"
                    checked={fixedAmount}
                    onCheckedChange={(checked) =>
                      setFixedAmount(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="fixed-amount"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Fixed Amount
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Amount cannot be edited by the payer.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              Generate QR Code
            </Button>
          </form>
        </div>

        {/* Previous UPI QR Codes Section */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-semibold text-foreground mb-1 md:mb-2">
              Previous UPI QR Codes
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Access and reuse recently generated QR codes.
            </p>
          </div>

          {/* Mobile: stacked cards to avoid horizontal scroll */}
          <div className="md:hidden space-y-3 -mx-4 px-4">
            {paginatedQRCodes.map((qr) => (
              <div key={qr.id} className="bg-card border border-border rounded-xl p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{qr.name}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">₹{qr.amount.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-muted-foreground text-xs truncate">{qr.purpose}</div>
                    <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{qr.description}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className={cn("capitalize text-xs", getStatusBadgeClass(qr.status))}>{qr.status}</Badge>
                      <div className="text-xs text-muted-foreground">{qr.usageType}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => viewQR(qr.qrUrl)} title="View QR">
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => copyQRUrl(qr.qrUrl)} title="Copy URL">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => downloadQR(qr.id)} title="Download QR">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{qr.expiresIn}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table className="text-xs md:text-sm min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="">Name</TableHead>
                  <TableHead className="">Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                  <TableHead className="hidden lg:table-cell">Usage Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Created On</TableHead>
                  <TableHead className="">Expires In</TableHead>
                  <TableHead className="">Status</TableHead>
                  <TableHead className="">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQRCodes.map((qr) => (
                  <TableRow key={qr.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium max-w-[220px] lg:max-w-[320px] truncate">{qr.name}</TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">₹{qr.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="max-w-[360px] hidden lg:table-cell break-words">
                      <div className="">{qr.purpose}</div>
                      <div className="text-xs text-muted-foreground">{qr.description}</div>
                    </TableCell>
                    <TableCell className="capitalize hidden lg:table-cell">{qr.usageType}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell truncate max-w-[140px]">{qr.createdOn}</TableCell>
                    <TableCell className="text-sm">{qr.expiresIn}</TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", getStatusBadgeClass(qr.status))}>{qr.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => viewQR(qr.qrUrl)} title="View QR">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyQRUrl(qr.qrUrl)} title="Copy URL">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadQR(qr.id)} title="Download QR">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {displayedQRCodes.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={displayedQRCodes.length}
                itemName="QR code"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpiQrCode;
