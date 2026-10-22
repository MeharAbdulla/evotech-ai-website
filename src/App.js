import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import HomePage from "./pages/HomePage";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Analytics />
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
