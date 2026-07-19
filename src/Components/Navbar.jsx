import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";

const navLinks = [
  { name: "Services", to: "/services" },
  { name: "Projects", to: "/projects" },
  { name: "Team", to: "/team" },
  { name: "Gigs", to: "/gigs" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
      isActive ? "text-white" : "text-slate-400 hover:text-white"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans antialiased ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group relative z-50 select-none">
          <img
            src="/logo.png"
            alt="EVO Tech AI Logo"
            className="w-9 h-9 object-contain transform transition-transform duration-500 group-hover:rotate-[10deg]"
          />
          <span className="font-bold text-white text-lg tracking-wide uppercase font-sans">
            EVO Tech <span className="text-[#38bdf8] transition-colors duration-300 group-hover:text-white">AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.to} className={linkClass}>
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#38bdf8] to-blue-500 transition-transform duration-300 origin-center rounded-full ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-slate-900 border border-cyan-500/30 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#38bdf8] hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] group"
          >
            Get in Touch
            <FiArrowUpRight className="w-4 h-4 text-[#38bdf8] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          className="lg:hidden relative z-50 p-2 text-slate-400 hover:text-[#38bdf8] transition-colors duration-200 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 -z-10 bg-slate-950/95 backdrop-blur-xl border-b border-white/5 shadow-2xl pt-24 pb-8 px-6 overflow-hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-base font-medium py-3 px-4 rounded-xl hover:bg-white/5 transition-all ${
                        isActive ? "text-[#38bdf8] bg-white/[0.02]" : "text-slate-400 hover:text-[#38bdf8]"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-6 mx-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#38bdf8] to-blue-600 text-slate-950 font-bold py-3.5 rounded-xl"
              >
                Get in Touch
                <FiArrowUpRight className="w-4 h-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
