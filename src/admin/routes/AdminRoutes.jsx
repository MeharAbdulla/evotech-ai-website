import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Developers from "../pages/Developers";
import Services from "../pages/Services";
import Gigs from "../pages/Gigs";
import CompanyInfo from "../pages/CompanyInfo";
import Messages from "../pages/Messages";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="developers" element={<Developers />} />
        <Route path="services" element={<Services />} />
        <Route path="gigs" element={<Gigs />} />
        <Route path="company-info" element={<CompanyInfo />} />
        <Route path="messages" element={<Messages />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
