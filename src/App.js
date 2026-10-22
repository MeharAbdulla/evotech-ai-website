import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import PublicLayout from "./Components/PublicLayout";
import GoogleAnalytics from "./Components/GoogleAnalytics";
import ToastProvider from "./admin/components/ToastProvider";
import ProtectedRoute from "./admin/routes/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const GigsPage = lazy(() => import("./pages/GigsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const RcPlanesPage = lazy(() => import("./pages/RcPlanesPage"));
const RcPlaneDetails = lazy(() => import("./pages/RcPlaneDetails"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const Login = lazy(() => import("./admin/pages/Login"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Projects = lazy(() => import("./admin/pages/Projects"));
const Developers = lazy(() => import("./admin/pages/Developers"));
const Services = lazy(() => import("./admin/pages/Services"));
const Gigs = lazy(() => import("./admin/pages/Gigs"));
const Blog = lazy(() => import("./admin/pages/Blog"));
const CompanyInfo = lazy(() => import("./admin/pages/CompanyInfo"));
const Messages = lazy(() => import("./admin/pages/Messages"));
const Users = lazy(() => import("./admin/pages/Users"));
const Settings = lazy(() => import("./admin/pages/Settings"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-black">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetails />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/gigs" element={<GigsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/rc-planes" element={<RcPlanesPage />} />
              <Route path="/rc-planes/:slug" element={<RcPlaneDetails />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
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
              <Route path="blog" element={<Blog />} />
              <Route path="company-info" element={<CompanyInfo />} />
              <Route path="messages" element={<Messages />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
