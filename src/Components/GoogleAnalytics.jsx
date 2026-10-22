import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = (process.env.REACT_APP_GA_MEASUREMENT_ID || "").trim();

function ensureGtag(measurementId) {
  if (typeof window === "undefined" || !measurementId) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/**
 * Google Analytics 4 — set REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXX on Vercel.
 */
export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID) return;
    ensureGtag(GA_ID);
  }, []);

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);

  return null;
}
