import React from "react";
import { Link } from "react-router-dom";
import Seo from "../Components/Seo";

export default function NotFound() {
  return (
    <section className="relative min-h-screen bg-black text-slate-100 px-4 sm:px-6 pt-28 pb-24 flex items-center">
      <Seo
        title="Page not found"
        description="The page you requested does not exist on Aeromek AI."
        path="/404"
        noindex
      />
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sky-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">404</p>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-slate-400 leading-relaxed">
          This URL is not available. Explore our services, projects, or blog instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-sky-400 text-[#05070d] text-sm font-bold hover:bg-sky-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
          >
            Services
          </Link>
          <Link
            to="/blog"
            className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
