// src/utils/bookingTransformer.ts

export interface Booking {
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


export function transformBookings(apiArray: any[]): Booking[] {
  return apiArray.map((api) => {
    const term1 = Number(api.term_1 || 0);
    const term2 = Number(api.term_2 || 0);
    const term3 = Number(api.term_3 || 0);

    const receivedAmount = term1 + term2 + term3;
    const totalAmount = Number(api.total_amount || 0);
    const pendingAmount = Math.max(totalAmount - receivedAmount, 0);

    const formatDate = (date: string) =>
      date ? new Date(date).toISOString().slice(0, 10) : "";

    return {
      id: api._id || "",
      bookingDate: formatDate(api.date),
      paymentDate: formatDate(api.payment_date),
      companyName: api.company_name || "",
      contactPerson: api.contact_person || "",
      email: api.email || "",
      contactNumber:
        typeof api.contact_no === "number"
          ? `+91 ${api.contact_no}`
          : api.contact_no || "",
      service: Array.isArray(api.services)
        ? api.services.join(", ")
        : api.services || "",
      term: api.term || "Term-Based",
      totalAmount,
      receivedAmount,
      pendingAmount,
      paymentMode: api.bank || "",
      status: api.status || "",
      bdmName: api.bdm || "",
      closeBy: api.closed_by || "",
      state: api.state || "",
      afterFundDisbursement: String(api.after_disbursement || ""),
      notes: api.remark || "",
    };
  });
}
