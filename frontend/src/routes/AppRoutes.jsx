import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Invoices from "../pages/dashboard/Invoices";
import CreateInvoice from "../pages/dashboard/CreateInvoice";
import BusinessProfile from "../pages/dashboard/BusinessProfile";

import EditInvoice from "../pages/dashboard/EditInvoice";
import InvoicePreview from "../pages/dashboard/InvoicePreview";
import CreateAI from "../pages/dashboard/CreateAI";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<DashboardLayout />}>

          <Route index element={<DashboardHome />} />

          <Route path="invoices" element={<Invoices />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="business-profile" element={<BusinessProfile />} />
          <Route path="create-ai" element={<CreateAI />} />

          <Route path="edit/:id" element={<EditInvoice />} />
          <Route path="preview/:id" element={<InvoicePreview />} />

        </Route>

      </Route>

      <Route path="*" element={<h1 className="text-center mt-10">404 Not Found</h1>} />

    </Routes>

  )
}