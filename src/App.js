import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./Components/PublicLayout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import TeamPage from "./pages/TeamPage";
import GigsPage from "./pages/GigsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProjectDetails from "./pages/ProjectDetails";

import AdminRoutes from "./admin/routes/AdminRoutes";
import ToastProvider from "./admin/components/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
