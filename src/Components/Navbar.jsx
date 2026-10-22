import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";

const navLinks = [
  { name: "Services", to: "/services" },
  { name: "Projects", to: "/projects" },
  { name: "Team", to: "/team" },
  { name: "Gigs", to: "/gigs" },
  { name: "RC Planes", to: "/rc-planes" },
  { name: "Blog", to: "/blog" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkClass = ({ isActive }) =>
    `relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
      isActive ? "text-white" : "text-slate-400 hover:text-white"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans antialiased ${
        scrolled
          ? "bg-[#03050a]/90 backdrop-blur-xl border-b border-sky-500/15 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          : "bg-gradient-to-b from-black/50 to-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between">
        <Link to="/" className="relative z-50 select-none shrink-0">
          <img
            src="/logo-transparent.png"
            alt="Aeromek AI"
            className="h-9 sm:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.to} className={linkClass}>
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-sky-400 rounded-full transition-transform duration-300 origin-center ${
                      isActive ? "scale-x-100" : "scale-x-0"
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 px-5 py-2.5 text-sm font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(56,189,248,0.25)] group"
          >
            Get in Touch
            <FiArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          className="lg:hidden relative z-50 p-2 text-slate-300 hover:text-sky-400 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#03050a]/98 backdrop-blur-xl pt-20 pb-8 px-4 overflow-y-auto"
          >
            <nav className="flex flex-col gap-1 max-w-lg mx-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex py-3.5 px-4 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "text-sky-400 bg-sky-400/5"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
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
                className="mt-5 mx-2 flex items-center justify-center gap-2 bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl"
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
