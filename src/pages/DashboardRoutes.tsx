import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./Index"; // Dashboard home
import NewBooking from "./NewBooking";
import AllBookings from "./AllBookings";
import PaymentLink from "./PaymentLink";
import UpiQrCode from "./UpiQrCode";
import ManageServices from "./ManageServices";
import ManageUsers from "./ManageUsers";
import ProformaInvoice from "./ProformaInvoice";
import Trash from "./Trash";
import Settings from "./Settings";
import Profile from "./Profile";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="new-booking"
        element={
          <ProtectedRoute routePath="/dashboard/new-booking">
            <NewBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="all-bookings"
        element={
          <ProtectedRoute routePath="/dashboard/all-bookings">
            <AllBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-link"
        element={
          <ProtectedRoute routePath="/dashboard/payment-link">
            <PaymentLink />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-qr"
        element={
          <ProtectedRoute routePath="/dashboard/payment-qr">
            <UpiQrCode />
          </ProtectedRoute>
        }
      />
      <Route
        path="manage-services"
        element={
          <ProtectedRoute routePath="/dashboard/manage-services">
            <ManageServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="manage-users"
        element={
          <ProtectedRoute routePath="/dashboard/manage-users">
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="proforma-invoice"
        element={
          <ProtectedRoute routePath="/dashboard/proforma-invoice">
            <ProformaInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="trash"
        element={
          <ProtectedRoute routePath="/dashboard/trash">
            <Trash />
          </ProtectedRoute>
        }
      />
      <Route path="settings" element={<Settings />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default DashboardRoutes;
