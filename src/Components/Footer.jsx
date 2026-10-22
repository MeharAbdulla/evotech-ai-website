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
      { label: "RC Airplanes", to: "/rc-planes" },
      { label: "Blog", to: "/blog" },
      { label: "Our Team", to: "/team" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Computer Vision", to: "/services/computer-vision" },
      { label: "YOLO Development", to: "/services/yolo" },
      { label: "Embedded Systems", to: "/services/embedded-systems" },
      { label: "IoT Development", to: "/services/iot" },
      { label: "PCB Design", to: "/services/pcb-design" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Home", to: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-sky-500/15 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center mb-5">
              <img
                src="/logo-transparent.png"
                alt="Aeromek AI"
                className="h-14 sm:h-[4.5rem] w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Aeromek AI specializes in workplace computer vision and object detection —
              plus robotics, agents, PCB, and IoT when your project needs the full stack.
            </p>
            <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.25em] text-sky-400/80">
              Automate · Innovate · Elevate
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <a
                href="mailto:aeromekai@gmail.com"
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <FiMail className="text-sky-400" /> aeromekai@gmail.com
              </a>
              <a
                href="tel:+923217691508"
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <FiPhone className="text-sky-400" /> +923217691508
              </a>
              <p className="inline-flex items-center gap-2">
                <FiMapPin className="text-sky-400" /> Engineering &amp; remote delivery worldwide
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
                      className="text-sm text-slate-500 hover:text-sky-300 transition-colors"
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
            © {new Date().getFullYear()} Aeromek AI. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-sky-300">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-sky-300">
              Terms
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              Discuss a vision project <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
