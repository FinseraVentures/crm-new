import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { format } from "date-fns";
import {
  CalendarIcon,
  Building2,
  User,
  Phone,
  Mail,
  IndianRupee,
  FileText,
  CloudCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CONFIG, { API_ENDPOINTS, getApiUrl } from "@/config/env";


interface Booking {
  id: string;
  customerName: string;
  contact: string;
  amount: number;
  description: string;
  createdOn: string;
  link: string;
}

export interface FormDataType {
  branch: string;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  date: string; // YYYY-MM-DD format
  services: string[]; // array since it's []
  totalAmount: string;
  selectTerm: string;
  amount: string;
  paymentDate: string;
  closed: string;
  pan: string;
  gst: string;
  notes: string;
  bank: string;
  state: string;
  funddisbursement: string;
}
const initialState: FormDataType = {
  branch: "",
  companyName: "",
  contactPerson: "",
  contactNumber: "",
  email: "",
  date: "",
  services: [],
  totalAmount: "",
  selectTerm: "",
  amount: "",
  paymentDate: "",
  closed: "",
  pan: "",
  gst: "",
  notes: "",
  bank: "",
  state: "",
  funddisbursement: "",
};

const servicesOptions: MultiSelectOption[] = [
  { label: "Accounting", value: "accounting" },
  { label: "Tax Filing", value: "tax-filing" },
  { label: "Audit", value: "audit" },
  { label: "Payroll", value: "payroll" },
  { label: "Consulting", value: "consulting" },
  { label: "Bookkeeping", value: "bookkeeping" },
];

const branches = ["Noida 402"];
const terms = ["Term 1", "Term 2", "Term 3", "Term 4" ,"Custom"];
const paymentModes = ["KOTAK MAHINDRA BANK", "Cash", "RAZORPAY", "Cheque", "PayU"];
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const NewBooking = () => {
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState<Date>();
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormDataType>(initialState);


    const [errors, setErrors] = useState({});


    //  const validate = () => {
    //    let validationErrors = {};

    //    // Validation logic (unchanged)
    //    if (!formData.branch) validationErrors.branch = "Branch is required";
    //    // if (!formData.companyName) validationErrors.companyName = "Company Name is required";
    //    if (!formData.contactPerson)
    //      validationErrors.contactPerson = "Contact Person is required";
    //    const contactNumberRegex = /^\d{10}$/;
    //    if (
    //      !formData.contactNumber ||
    //      !contactNumberRegex.test(formData.contactNumber)
    //    ) {
    //      validationErrors.contactNumber =
    //        "Valid Contact Number is required (10 digits, no spaces)";
    //    }
    //    if (!formData.email) validationErrors.email = "Email is required";
    //    if (!formData.date) validationErrors.date = "Date is required";
    //    if (!formData.totalAmount || isNaN(formData.totalAmount)) {
    //      validationErrors.totalAmount = "Valid Total Amount is required";
    //    }
    //    if (!formData.selectTerm)
    //      validationErrors.selectTerm = "Select Term is required";
    //    if (!formData.amount || isNaN(formData.amount)) {
    //      validationErrors.amount = "Valid Amount is required";
    //    }
    //    if (Number(formData.amount) > Number(formData.totalAmount)) {
    //      validationErrors.amount =
    //        "Received Amount cannot be greater than Total Amount";
    //    }
    //    if (!formData.paymentDate)
    //      validationErrors.paymentDate = "Payment Date is required";
    //    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    //    if (formData.pan && !panRegex.test(formData.pan)) {
    //      validationErrors.pan =
    //        "Valid PAN is required (10 characters, no spaces, no special characters)";
    //    }
    //    setErrors(validationErrors);
    //    return Object.keys(validationErrors).length === 0;
    //  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(formData)
    e.preventDefault();
    toast.success("Booking created successfully!");
  };

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header block: breadcrumbs + title aligned together */}

        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "New Booking" },
          ]}
        />

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            New Booking
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Enter booking details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-4 md:p-8 space-y-6 md:space-y-8 shadow-sm"
        >
          {/* Business Details Section */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-secondary" />
              Business Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      branch: value,
                    }))
                  }
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch.toLowerCase()}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-person"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-number">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-date">Booking Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="booking-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? (
                        format(bookingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={(date) => {
                        if (!date) return;

                        // update local date state
                        setBookingDate(date);

                        // update formData
                        setFormData((prev) => ({
                          ...prev,
                          date: date.toISOString().split("T")[0], // YYYY-MM-DD
                        }));
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="services">Services</Label>
                <MultiSelect
                  options={servicesOptions}
                  selected={selectedServices}
                  onChange={(values: string[]) => {
                    setSelectedServices(values); // optional local state (if you need it)

                    setFormData((prev) => ({
                      ...prev,
                      services: values, // update formData
                    }));
                  }}
                  placeholder="Select services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pan"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="pl-10 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst">GST Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="gst"
                    name="gst"
                    value={formData.gst}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gst: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="22AAAAA0000A1Z5"
                    className="pl-10 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, state: val }))
                  }
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem
                        key={state}
                        value={state.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="close-by">Close By</Label>
                <Input
                  id="close-by"
                  name="closed"
                  value={formData.closed}
                  onChange={handleChange}
                  placeholder="Enter name or department"
                />
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-6 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-success" />
              Payment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="total-amount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select
                  value={formData.selectTerm}
                  onValueChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, selectTerm: val }))
                  }
                >
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term) => (
                      <SelectItem key={term} value={term.toLowerCase()}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="received-amount">Received Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="received-amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="payment-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={(date) => {
                        if (!date) return;

                        // Update UI date
                        setPaymentDate(date);

                        // Update formData
                        setFormData((prev) => ({
                          ...prev,
                          paymentDate: date.toISOString().split("T")[0],
                        }));
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Select
                  value={formData.bank}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, bank: val }))
                  }
                >
                  <SelectTrigger id="payment-mode">
                    <SelectValue placeholder="Select payment mode" />
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
                <Label htmlFor="fund-disbursement">
                  After Fund Disbursement
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fund-disbursement"
                    name="funddisbursement"
                    value={formData.funddisbursement}
                    onChange={handleChange}
                    placeholder="After Fund Disbursement"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs md:text-sm">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments..."
              className="min-h-24 md:min-h-32 resize-none text-xs md:text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-3 md:pt-4">
            <Button type="submit" className="flex-1 text-sm">
              Submit Booking
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1 text-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewBooking;
