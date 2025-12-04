import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Download, FileText, Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { InvoicePreview } from "./InvoicePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 10;

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ClientDetails {
  companyName: string;
  contactPerson: string;
  email: string;
  gstPan: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
}

export interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientDetails: ClientDetails;
  items: InvoiceItem[];
  includeGST: boolean;
  subtotal: number;
  gst: number;
  total: number;
  createdAt: string;
}

interface PreviousInvoicesProps {
  invoices: SavedInvoice[];
  onDelete: (id: string) => void;
  onEdit?: (invoice: SavedInvoice) => void;
}

// Mock data for demo
export const mockInvoices: SavedInvoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "PI-2025-001",
    invoiceDate: "2025-11-15",
    clientDetails: {
      companyName: "TechCorp Solutions Pvt Ltd",
      contactPerson: "Rahul Sharma",
      email: "rahul@techcorp.com",
      gstPan: "27AABCT1234R1ZX",
      streetAddress: "456 Tech Park, Sector 5",
      city: "Bangalore",
      state: "Karnataka",
      postcode: "560001",
    },
    items: [
      {
        id: "1",
        description: "Web Development Services",
        quantity: 1,
        rate: 150000,
        amount: 150000,
      },
      {
        id: "2",
        description: "UI/UX Design",
        quantity: 1,
        rate: 50000,
        amount: 50000,
      },
    ],
    includeGST: true,
    subtotal: 200000,
    gst: 36000,
    total: 236000,
    createdAt: "2025-11-15T10:30:00",
  },
  {
    id: "INV-002",
    invoiceNumber: "PI-2025-002",
    invoiceDate: "2025-11-20",
    clientDetails: {
      companyName: "Global Exports Ltd",
      contactPerson: "Priya Patel",
      email: "priya@globalexports.com",
      gstPan: "24AABCG5678R1ZX",
      streetAddress: "789 Commerce Hub",
      city: "Ahmedabad",
      state: "Gujarat",
      postcode: "380001",
    },
    items: [
      {
        id: "1",
        description: "Consulting Services",
        quantity: 40,
        rate: 5000,
        amount: 200000,
      },
    ],
    includeGST: true,
    subtotal: 200000,
    gst: 36000,
    total: 236000,
    createdAt: "2025-11-20T14:15:00",
  },
  {
    id: "INV-003",
    invoiceNumber: "PI-2025-003",
    invoiceDate: "2025-11-25",
    clientDetails: {
      companyName: "StartUp Innovations",
      contactPerson: "Amit Kumar",
      email: "amit@startupinnovations.io",
      gstPan: "29AABCS9012R1ZX",
      streetAddress: "101 Innovation Center",
      city: "Hyderabad",
      state: "Telangana",
      postcode: "500001",
    },
    items: [
      {
        id: "1",
        description: "Mobile App Development",
        quantity: 1,
        rate: 300000,
        amount: 300000,
      },
      {
        id: "2",
        description: "Backend API Development",
        quantity: 1,
        rate: 100000,
        amount: 100000,
      },
      {
        id: "3",
        description: "Cloud Infrastructure Setup",
        quantity: 1,
        rate: 50000,
        amount: 50000,
      },
    ],
    includeGST: false,
    subtotal: 450000,
    gst: 0,
    total: 450000,
    createdAt: "2025-11-25T09:00:00",
  },
  {
    id: "INV-004",
    invoiceNumber: "PI-2025-004",
    invoiceDate: "2025-11-28",
    clientDetails: {
      companyName: "Digital Marketing Pro",
      contactPerson: "Sneha Reddy",
      email: "sneha@digitalmarketingpro.com",
      gstPan: "36AABCD1234R1ZX",
      streetAddress: "202 Marketing Tower",
      city: "Chennai",
      state: "Tamil Nadu",
      postcode: "600001",
    },
    items: [
      {
        id: "1",
        description: "SEO Services",
        quantity: 6,
        rate: 25000,
        amount: 150000,
      },
    ],
    includeGST: true,
    subtotal: 150000,
    gst: 27000,
    total: 177000,
    createdAt: "2025-11-28T11:00:00",
  },
];

export const PreviousInvoices = ({
  invoices,
  onDelete,
  onEdit,
}: PreviousInvoicesProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<SavedInvoice | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, invoices.length);
  const paginatedInvoices = invoices.slice(startIndex, endIndex);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentPage(1);
  }, [invoices.length]);

  const handleView = (invoice: SavedInvoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const handleDownload = async (invoice: SavedInvoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);

    toast({
      title: "Generating PDF",
      description: "Please wait while we create your invoice...",
    });

    setTimeout(async () => {
      const element = document.getElementById("invoice-preview");
      if (!element) return;

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`Finsera_Invoice_${invoice.invoiceNumber}.pdf`);

        toast({
          title: "Download Complete",
          description: "Your invoice PDF has been downloaded.",
        });

        setShowPreview(false);
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "There was an error generating the PDF.",
          variant: "destructive",
        });
      }
    }, 500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (invoices.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Previous Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No invoices created yet.</p>
            <p className="text-sm">Your saved invoices will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Previous Invoices ({invoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.invoiceDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {invoice.clientDetails.companyName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.clientDetails.contactPerson}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.includeGST ? "default" : "secondary"}
                      >
                        {invoice.includeGST ? "Included" : "Excluded"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(invoice)}
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(invoice)}
                          title="Edit Invoice"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(invoice)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(invoice.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
              startIndex={startIndex + 1}
              endIndex={endIndex}
              totalItems={invoices.length}
              itemName="invoices"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {selectedInvoice && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Invoice Preview - {selectedInvoice.invoiceNumber}
              </DialogTitle>
            </DialogHeader>
            <InvoicePreview
              invoiceDate={new Date(selectedInvoice.invoiceDate)}
              clientDetails={selectedInvoice.clientDetails}
              items={selectedInvoice.items}
              includeGST={selectedInvoice.includeGST}
              subtotal={selectedInvoice.subtotal}
              gst={selectedInvoice.gst}
              total={selectedInvoice.total}
            />
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button
                onClick={() => handleDownload(selectedInvoice)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
