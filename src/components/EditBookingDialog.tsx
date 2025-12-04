import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { format, parse } from "date-fns";
import { CalendarIcon, Building2, User, Phone, Mail, DollarSign, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const servicesOptions: MultiSelectOption[] = [
  { label: "MSME", value: "msme" },
  { label: "GST", value: "gst" },
  { label: "PMEGP", value: "pmegp" },
  { label: "Startup Certificate", value: "startup-certificate" },
  { label: "Loan", value: "loan" },
  { label: "Accounting", value: "accounting" },
  { label: "Tax Filing", value: "tax-filing" },
];

const branches = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"];
const terms = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const paymentModes = ["UPI", "Cash", "Bank Transfer", "Cheque", "Card"];
const statuses = ["New", "In Process", "Completed", "Cancelled"];
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

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

interface EditBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (booking: Booking) => void;
}

export function EditBookingDialog({ booking, open, onOpenChange, onSave }: EditBookingDialogProps) {
  const [bookingDate, setBookingDate] = useState<Date>();
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    contactNumber: "",
    term: "",
    totalAmount: "",
    receivedAmount: "",
    paymentMode: "",
    status: "",
    bdmName: "",
    closeBy: "",
    state: "",
    afterFundDisbursement: "",
    notes: "",
  });

  useEffect(() => {
    if (booking) {
      // Parse dates
      setBookingDate(parse(booking.bookingDate, "yyyy-MM-dd", new Date()));
      setPaymentDate(parse(booking.paymentDate, "yyyy-MM-dd", new Date()));
      
      // Parse services
      const services = booking.service.split(", ").map(s => 
        s.toLowerCase().replace(/\s+/g, "-")
      );
      setSelectedServices(services);
      
      // Set form data
      setFormData({
        companyName: booking.companyName,
        contactPerson: booking.contactPerson,
        email: booking.email,
        contactNumber: booking.contactNumber,
        term: booking.term,
        totalAmount: booking.totalAmount.toString(),
        receivedAmount: booking.receivedAmount.toString(),
        paymentMode: booking.paymentMode,
        status: booking.status,
        bdmName: booking.bdmName,
        closeBy: booking.closeBy,
        state: booking.state,
        afterFundDisbursement: booking.afterFundDisbursement,
        notes: booking.notes,
      });
    }
  }, [booking]);

  const handleSave = () => {
    if (!booking || !bookingDate || !paymentDate) return;

    const totalAmount = parseFloat(formData.totalAmount);
    const receivedAmount = parseFloat(formData.receivedAmount);
    const pendingAmount = totalAmount - receivedAmount;

    const updatedBooking: Booking = {
      ...booking,
      bookingDate: format(bookingDate, "yyyy-MM-dd"),
      paymentDate: format(paymentDate, "yyyy-MM-dd"),
      service: selectedServices.map(s => {
        const option = servicesOptions.find(opt => opt.value === s);
        return option?.label || s;
      }).join(", "),
      totalAmount,
      receivedAmount,
      pendingAmount,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      contactNumber: formData.contactNumber,
      term: formData.term,
      paymentMode: formData.paymentMode,
      status: formData.status,
      bdmName: formData.bdmName,
      closeBy: formData.closeBy,
      state: formData.state,
      afterFundDisbursement: formData.afterFundDisbursement,
      notes: formData.notes,
    };

    onSave(updatedBooking);
    toast.success("Booking updated successfully!");
    onOpenChange(false);
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booking - {booking.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input
                  id="contact-number"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-date">Booking Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !bookingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Services</Label>
                <MultiSelect
                  options={servicesOptions}
                  selected={selectedServices}
                  onChange={setSelectedServices}
                  placeholder="Select services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bdm">BDM Name</Label>
                <Input
                  id="bdm"
                  value={formData.bdmName}
                  onChange={(e) => setFormData({ ...formData, bdmName: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="close-by">Close By</Label>
                <Input
                  id="close-by"
                  value={formData.closeBy}
                  onChange={(e) => setFormData({ ...formData, closeBy: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount</Label>
                <Input
                  id="total-amount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="received-amount">Received Amount</Label>
                <Input
                  id="received-amount"
                  type="number"
                  value={formData.receivedAmount}
                  onChange={(e) => setFormData({ ...formData, receivedAmount: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select value={formData.term} onValueChange={(value) => setFormData({ ...formData, term: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Select value={formData.paymentMode} onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fund-disbursement">After Fund Disbursement</Label>
                <Input
                  id="fund-disbursement"
                  value={formData.afterFundDisbursement}
                  onChange={(e) => setFormData({ ...formData, afterFundDisbursement: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-24 bg-background resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
