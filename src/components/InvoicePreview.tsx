import { format } from "date-fns";
import { Building2, Phone, Mail, CreditCard, MapPin } from "lucide-react";

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

interface InvoicePreviewProps {
  invoiceDate: Date;
  clientDetails: ClientDetails;
  items: InvoiceItem[];
  includeGST: boolean;
  subtotal: number;
  gst: number;
  total: number;
}

export const InvoicePreview = ({
  invoiceDate,
  clientDetails,
  items,
  includeGST,
  subtotal,
  gst,
  total,
}: InvoicePreviewProps) => {
  return (
    <div id="invoice-preview" className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Finsera Ventures
            </h1>
            <p className="text-sm font-semibold text-gray-700">
              Finsera Ventures Private Limited
            </p>
          </div>
          <div className="text-right">
            <div className="w-[120px] rounded-lg flex items-center justify-center mb-2">
              <img src="/images/Logo.png" alt="" />
            </div>
            <p className="text-xs text-gray-600">GST: 09AAGCF6398F1Z6</p>
          </div>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">PROFORMA INVOICE</h2>
        <p className="text-sm text-gray-600 mt-1">
          Invoice Date: {format(invoiceDate, "PPP")}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* From Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            From
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">
              Finsera Ventures Private Limited
            </p>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>+91 8448998265</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>support@finseraa.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                A-25 ARV Park, M1, 4th Floor , 402
                <br />
                Sec-63 Noida, Uttar Pradesh 201301
              </span>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Bill To
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">
              {clientDetails.companyName}
            </p>
            <p>{clientDetails.contactPerson}</p>
            <p>{clientDetails.email}</p>
            <p>
              <span className="font-medium">GST/PAN:</span>{" "}
              {clientDetails.gstPan}
            </p>
            <p>
              {clientDetails.streetAddress}
              <br />
              {clientDetails.city}, {clientDetails.state} -{" "}
              {clientDetails.postcode}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary/10">
              <th className="text-left p-3 text-sm font-bold text-gray-700 border border-gray-300">
                Description
              </th>
              <th className="text-center p-3 text-sm font-bold text-gray-700 border border-gray-300 w-24">
                Qty
              </th>
              <th className="text-right p-3 text-sm font-bold text-gray-700 border border-gray-300 w-32">
                Rate (₹)
              </th>
              <th className="text-right p-3 text-sm font-bold text-gray-700 border border-gray-300 w-32">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="p-3 text-sm text-gray-700 border border-gray-300">
                  {item.description}
                </td>
                <td className="p-3 text-sm text-gray-700 text-center border border-gray-300">
                  {item.quantity}
                </td>
                <td className="p-3 text-sm text-gray-700 text-right border border-gray-300">
                  {item.rate.toFixed(2)}
                </td>
                <td className="p-3 text-sm text-gray-700 text-right border border-gray-300">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700 py-2 border-b">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            {includeGST && (
              <div className="flex justify-between text-sm text-gray-700 py-2 border-b">
                <span>GST (18%):</span>
                <span className="font-medium">₹{gst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 py-3 bg-primary/5 px-4 rounded">
              <span>Total:</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Footer */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        <div className="space-y-3 text-xs text-gray-600">
          <div>
            <h4 className="font-bold text-gray-700 mb-1">Payment Terms:</h4>
            <p>Payment is due within 30 days of invoice date.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-1">Bank Details:</h4>
            <p>Bank: HDFC Bank | A/c: 50200012345678 | IFSC: HDFC0001234</p>
          </div>
        </div>
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2025 Finsera Ventures. All rights reserved. | Professional Invoice
            Generation System
          </p>
        </div>
      </div>
    </div>
  );
};
