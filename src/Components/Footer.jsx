import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Services", to: "/services" },
      { label: "Projects", to: "/projects" },
      { label: "Open Gigs", to: "/gigs" },
      { label: "Our Team", to: "/team" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Home", to: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="EVO Tech AI" className="w-9 h-9 object-contain" />
              <span className="font-bold text-white text-lg tracking-wide uppercase">
                EVO Tech <span className="text-[#38bdf8]">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              We build practical AI, robotics, embedded systems, and IoT solutions
              for real industrial use — from idea to working hardware and software.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <a
                href="mailto:evotechnologyus@gmail.com"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <FiMail className="text-cyan-400" /> evotechnologyus@gmail.com
              </a>
              <a
                href="tel:+923217691508"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <FiPhone className="text-cyan-400" /> 0321 7691508
              </a>
              <p className="inline-flex items-center gap-2">
                <FiMapPin className="text-cyan-400" /> Engineering &amp; remote delivery worldwide
              </p>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} EVO Tech AI. All rights reserved.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Start a project <FiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
