import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  PreviousInvoices,
  SavedInvoice,
  mockInvoices,
} from "@/components/PreviousInvoices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FileText,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  CreditCard,
  Plus,
  Eye,
  Download,
  Save,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { InvoicePreview } from "@/components/InvoicePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const STORAGE_KEY = "finsera_saved_invoices";

const ProformaInvoice = () => {
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [includeGST, setIncludeGST] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();

  const [clientDetails, setClientDetails] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    gstPan: "",
    streetAddress: "",
    city: "",
    state: "",
    postcode: "",
  });

  // Load saved invoices from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedInvoices(JSON.parse(stored));
    } else {
      // Initialize with mock data for demo
      setSavedInvoices(mockInvoices);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockInvoices));
    }
  }, []);

  const handleClientChange = (field: string, value: string) => {
    setClientDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return includeGST ? subtotal * 0.18 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const validateInvoice = () => {
    if (
      !clientDetails.companyName ||
      !clientDetails.contactPerson ||
      !clientDetails.email ||
      !clientDetails.gstPan ||
      !clientDetails.streetAddress ||
      !clientDetails.city ||
      !clientDetails.state ||
      !clientDetails.postcode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required client details.",
        variant: "destructive",
      });
      return false;
    }

    if (
      items.some(
        (item) => !item.description || item.quantity <= 0 || item.rate <= 0
      )
    ) {
      toast({
        title: "Invalid Items",
        description:
          "Please ensure all items have description, quantity, and rate.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePreview = () => {
    if (!validateInvoice()) return;
    setShowPreview(true);
  };

  const resetForm = () => {
    setClientDetails({
      companyName: "",
      contactPerson: "",
      email: "",
      gstPan: "",
      streetAddress: "",
      city: "",
      state: "",
      postcode: "",
    });
    setItems([{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }]);
    setIncludeGST(false);
    setInvoiceDate(new Date());
    setEditingInvoiceId(null);
  };

  const handleDownload = async () => {
    if (!validateInvoice()) return;

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your invoice...",
      });

      setShowPreview(true);

      setTimeout(async () => {
        const element = document.getElementById("invoice-preview");
        if (!element) return;

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
        pdf.save(`Finsera_Invoice_${format(invoiceDate, "yyyy-MM-dd")}.pdf`);

        toast({
          title: "Download Complete",
          description: "Your invoice PDF has been downloaded.",
        });
      }, 500);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSaveInvoice = () => {
    if (!validateInvoice()) return;

    if (editingInvoiceId) {
      // Update existing invoice
      const updated = savedInvoices.map((inv) =>
        inv.id === editingInvoiceId
          ? {
              ...inv,
              invoiceDate: format(invoiceDate, "yyyy-MM-dd"),
              clientDetails,
              items,
              includeGST,
              subtotal: calculateSubtotal(),
              gst: calculateGST(),
              total: calculateTotal(),
            }
          : inv
      );
      setSavedInvoices(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      toast({
        title: "Invoice Updated",
        description: `Invoice has been updated successfully.`,
      });
    } else {
      // Create new invoice
      const invoiceNumber = `PI-${format(new Date(), "yyyy")}-${String(
        savedInvoices.length + 1
      ).padStart(3, "0")}`;

      const newInvoice: SavedInvoice = {
        id: Date.now().toString(),
        invoiceNumber,
        invoiceDate: format(invoiceDate, "yyyy-MM-dd"),
        clientDetails,
        items,
        includeGST,
        subtotal: calculateSubtotal(),
        gst: calculateGST(),
        total: calculateTotal(),
        createdAt: new Date().toISOString(),
      };

      const updated = [newInvoice, ...savedInvoices];
      setSavedInvoices(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      toast({
        title: "Invoice Saved",
        description: `Invoice ${invoiceNumber} has been saved successfully.`,
      });
    }

    resetForm();
  };

  const handleDeleteInvoice = (id: string) => {
    const updated = savedInvoices.filter((inv) => inv.id !== id);
    setSavedInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: "Invoice Deleted",
      description: "The invoice has been removed.",
    });
  };

  const handleEditInvoice = (invoice: SavedInvoice) => {
    setEditingInvoiceId(invoice.id);
    setClientDetails(invoice.clientDetails);
    setItems(invoice.items);
    setIncludeGST(invoice.includeGST);
    setInvoiceDate(new Date(invoice.invoiceDate));

    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });

    toast({
      title: "Editing Invoice",
      description: `Now editing ${invoice.invoiceNumber}. Make changes and click Save.`,
    });
  };

  const handleViewInvoice = (invoice: SavedInvoice) => {
    setClientDetails(invoice.clientDetails);
    setItems(invoice.items);
    setIncludeGST(invoice.includeGST);
    setInvoiceDate(new Date(invoice.invoiceDate));
    setShowPreview(true);
  };

  const handleDownloadInvoice = async (invoice: SavedInvoice) => {
    // Temporarily set the invoice data for preview
    const prevClient = { ...clientDetails };
    const prevItems = [...items];
    const prevGST = includeGST;
    const prevDate = invoiceDate;

    setClientDetails(invoice.clientDetails);
    setItems(invoice.items);
    setIncludeGST(invoice.includeGST);
    setInvoiceDate(new Date(invoice.invoiceDate));

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your invoice...",
      });

      setShowPreview(true);

      setTimeout(async () => {
        const element = document.getElementById("invoice-preview");
        if (!element) return;

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
        pdf.save(`${invoice.invoiceNumber}.pdf`);

        toast({
          title: "Download Complete",
          description: "Your invoice PDF has been downloaded.",
        });

        // Restore previous values if not editing
        if (!editingInvoiceId) {
          setClientDetails(prevClient);
          setItems(prevItems);
          setIncludeGST(prevGST);
          setInvoiceDate(prevDate);
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full px-2 sm:px-3 md:px-4 py-4 md:py-6 space-y-6 md:space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Proforma Invoice" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-primary/10 p-3 sm:p-4">
              <FileText className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            Proforma Invoice Generator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create professional invoices with ease.
          </p>
          {editingInvoiceId && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
              <span>Editing Invoice</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Main Invoice Card */}
        <Card className="shadow-sm border border-border w-full overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 w-full overflow-x-hidden">
            {/* Section 1: Company Details */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    Finsera Ventures
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    Finsera Ventures Private Limited
                  </p>
                  <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+91 8448998265</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>support@finsera.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>GST: 09AAGCF6398F1Z6</span>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>
                        A-25 ARV Park, M1, 4th Floor, 402
                        <br />
                        Sec-63 Noida, Uttar Pradesh 201301
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-auto md:w-[120px] rounded-lg flex items-center justify-center shrink-0 mt-3 sm:mt-4 md:mt-0">
                  <img
                    src="/images/Logo.png"
                    alt="Finsera Logo"
                    className="max-h-8 sm:max-h-10 md:max-h-16 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Client Details */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                Client Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="companyName" className="text-xs sm:text-sm">
                    Company Name *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      className="pl-10 text-sm"
                      value={clientDetails.companyName}
                      onChange={(e) =>
                        handleClientChange("companyName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="contactPerson" className="text-xs sm:text-sm">
                    Contact Person Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPerson"
                      placeholder="Enter contact person"
                      className="pl-10 text-sm"
                      value={clientDetails.contactPerson}
                      onChange={(e) =>
                        handleClientChange("contactPerson", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10 text-sm"
                      value={clientDetails.email}
                      onChange={(e) =>
                        handleClientChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="gstPan" className="text-xs sm:text-sm">
                    GST Number / PAN *
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gstPan"
                      placeholder="GST or PAN number"
                      className="pl-10 text-sm"
                      value={clientDetails.gstPan}
                      onChange={(e) =>
                        handleClientChange("gstPan", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                  <Label htmlFor="streetAddress" className="text-xs sm:text-sm">
                    Street Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="streetAddress"
                      placeholder="Street address"
                      className="pl-10 text-sm"
                      value={clientDetails.streetAddress}
                      onChange={(e) =>
                        handleClientChange("streetAddress", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="city" className="text-xs sm:text-sm">
                    City *
                  </Label>
                  <Input
                    id="city"
                    placeholder="City"
                    className="text-sm"
                    value={clientDetails.city}
                    onChange={(e) => handleClientChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="state" className="text-xs sm:text-sm">
                    Region / State *
                  </Label>
                  <Input
                    id="state"
                    placeholder="State"
                    className="text-sm"
                    value={clientDetails.state}
                    onChange={(e) =>
                      handleClientChange("state", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="postcode" className="text-xs sm:text-sm">
                    Postcode *
                  </Label>
                  <Input
                    id="postcode"
                    placeholder="Postcode"
                    className="text-sm"
                    value={clientDetails.postcode}
                    onChange={(e) =>
                      handleClientChange("postcode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Invoice Date */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-[280px] justify-start text-left font-normal text-sm",
                      !invoiceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceDate ? (
                      format(invoiceDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={(date) => date && setInvoiceDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Section 4: Items / Services */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                  Items / Services
                </h3>
                <Button
                  onClick={addItem}
                  size="sm"
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg border"
                  >
                    <div className="md:col-span-5">
                      <Label className="text-xs text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        Rate (₹)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "rate",
                            Number(e.target.value)
                          )
                        }
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        Amount (₹)
                      </Label>
                      <div className="mt-1 h-10 px-3 rounded-md border bg-muted flex items-center font-medium text-sm">
                        ₹{item.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex items-end">
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: GST Options */}
            <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeGST"
                  checked={includeGST}
                  onCheckedChange={(checked) =>
                    setIncludeGST(checked as boolean)
                  }
                />
                <label
                  htmlFor="includeGST"
                  className="text-xs sm:text-sm font-medium leading-none"
                >
                  Include GST (18%)
                </label>
              </div>
              {includeGST && (
                <div className="text-xs text-muted-foreground pl-6">
                  GST breakdown: CGST 9% + SGST 9% (or IGST 18% for interstate)
                </div>
              )}
            </div>

            {/* Section 6: Price Summary */}
            <div className="space-y-2 sm:space-y-3 p-4 sm:p-6 bg-muted/50 rounded-lg border-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ₹{calculateSubtotal().toFixed(2)}
                </span>
              </div>

              {includeGST && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">
                    ₹{calculateGST().toFixed(2)}
                  </span>
                </div>
              )}

              <div className="h-px bg-border" />

              <div className="flex justify-between text-base sm:text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Section 7: Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base h-auto"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Preview Invoice</span>
                <span className="sm:hidden">Preview</span>
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base h-auto"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-green-600 hover:bg-green-700 h-auto"
                onClick={handleSaveInvoice}
              >
                <Save className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">
                  {editingInvoiceId ? "Update Invoice" : "Save Invoice"}
                </span>
                <span className="sm:hidden">
                  {editingInvoiceId ? "Update" : "Save"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Invoices Section */}
        <div className="mt-6 sm:mt-8">
          <PreviousInvoices
            invoices={savedInvoices}
            onDelete={handleDeleteInvoice}
            onEdit={handleEditInvoice}
          />
        </div>

        {/* Footer */}
        <div className="text-center space-y-1 text-xs sm:text-sm text-muted-foreground pb-6 sm:pb-8">
          <p>© 2025 Finsera Ventures. All rights reserved.</p>
          <p>Professional Invoice Generation System</p>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">
              Invoice Preview
            </DialogTitle>
          </DialogHeader>

          <div id="invoice-preview">
            <InvoicePreview
              invoiceDate={invoiceDate}
              clientDetails={clientDetails}
              items={items}
              includeGST={includeGST}
              subtotal={calculateSubtotal()}
              gst={calculateGST()}
              total={calculateTotal()}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="py-2 px-3 text-xs sm:text-sm h-9"
            >
              Close
            </Button>
            <Button
              onClick={handleDownload}
              className="gap-2 py-2 px-3 text-xs sm:text-sm h-9"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProformaInvoice;
