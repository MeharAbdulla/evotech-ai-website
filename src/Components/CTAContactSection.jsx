import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiShield,
  FiGlobe,
  FiLock,
  FiCoffee,
  FiLayers,
  FiZap,
  FiArrowRight,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import apiClient from "../services/apiClient";

const featurePoints = [
  {
    id: 1,
    icon: FiCoffee,
    title: "Free Initial Consultation",
    description:
      "Deep-dive architecture analysis with senior engineering experts to scope your system requirements.",
  },
  {
    id: 2,
    icon: FiLayers,
    title: "End-to-End Engineering",
    description:
      "Turnkey development spanning multilayer PCB layout, embedded firmware execution, and edge-AI modeling.",
  },
  {
    id: 3,
    icon: FiGlobe,
    title: "Global Remote Collaboration",
    description:
      "Seamless deployment pipelines engineered for enterprise teams across the USA, Europe, UAE, KSA, and Pakistan.",
  },
  {
    id: 4,
    icon: FiZap,
    title: "Fast Project Delivery",
    description:
      "Agile sprints paired with robust internal diagnostic simulation benches for accelerated time-to-market.",
  },
];

const serviceOptions = [
  "WhatsApp AI Agent",
  "Lead Generation Agent",
  "AI CRM System",
  "Customer Support Agent",
  "Sales Outreach Agent",
  "Appointment Booking Agent",
  "Artificial Intelligence & Computer Vision",
  "Robotics & AMR Fleet Engineering",
  "Embedded Systems & Firmware Development",
  "Industrial IoT Telemetry Networks",
  "Autonomous Drone Flight Stacks",
  "Multilayer PCB Design & Electronics Prototype",
  "Industrial Automation Systems",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const leftItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

const rightItemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

const CTAContactSection = () => {
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    country: "",
    phoneNumber: "",
    service: "",
    budget: "",
    description: "",
  });

  useEffect(() => {
    const isHire = searchParams.get("hire") === "1";
    const gigTitle = searchParams.get("gig") || "";
    const gigBudget = searchParams.get("budget") || "";
    const gigCategory = searchParams.get("category") || "";

    if (!isHire && !gigTitle) return;

    setFormData((prev) => ({
      ...prev,
      description: gigTitle
        ? `I want to hire for this gig: ${gigTitle}${gigCategory ? ` (${gigCategory})` : ""}${gigBudget ? `. Budget range: ${gigBudget}` : ""}.`
        : prev.description,
      budget: gigBudget || prev.budget,
    }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await apiClient.post("/consultations/", {
        full_name: formData.fullName,
        company_name: formData.companyName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        country: formData.country,
        service: formData.service,
        budget: formData.budget,
        description: formData.description,
      });

      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        country: "",
        phoneNumber: "",
        service: "",
        budget: "",
        description: "",
      });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail.map((item) => item.msg).filter(Boolean).join(". ")
        : "";
      setSubmitError(
        typeof detail === "string"
          ? detail
          : validationMessage ||
            "Could not send your request. Please try again or email aeromekai@gmail.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-black text-slate-100 py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden font-sans antialiased"
    >
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-blue-900/12 blur-[160px] pointer-events-none" />

      {/* Static accents only — looping particles hurt scroll smoothness */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <span className="absolute left-[18%] top-[22%] w-1 h-1 bg-sky-400/25 rounded-full" />
        <span className="absolute left-[72%] top-[18%] w-1 h-1 bg-sky-400/20 rounded-full" />
        <span className="absolute left-[88%] top-[62%] w-1 h-1 bg-sky-400/20 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <span className="text-base sm:text-lg font-black tracking-[0.45em] uppercase text-sky-400 block">
              START YOUR PROJECT
            </span>
            <div className="h-[3px] w-12 bg-sky-400 mt-2 rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-slate-50 pb-3"
          >
            Let's Build Your Next Innovation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 mt-5 text-sm sm:text-base leading-relaxed"
          >
            Whether you need workplace camera AI, object detection, industrial inspection,
            robotics, embedded systems, or custom hardware, our team turns it into a
            production-ready system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="tel:+923217691508"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sm text-sky-300 hover:bg-sky-500/10 transition-colors"
            >
              <FiPhone /> +923217691508
            </a>
            <a
              href="mailto:aeromekai@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sm text-sky-300 hover:bg-sky-500/10 transition-colors"
            >
              <FiMail /> aeromekai@gmail.com
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-5 space-y-8"
          >
            <motion.div variants={leftItemVariants} className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
                Why engineering teams work with Aeromek
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                We combine computer vision, embedded systems, and hardware
                engineering so camera AI projects stay under one accountable
                team — from model choice and edge deployment to boards and
                integration when the project needs them.
              </p>
            </motion.div>

            <div className="space-y-6">
              {featurePoints.map((point) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.id}
                    variants={leftItemVariants}
                    className="flex gap-4 items-start group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 text-cyan-400 flex items-center justify-center shrink-0 group-hover:text-white group-hover:border-cyan-400/30 transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                        {point.title}
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-xs leading-relaxed mt-1">
                        {point.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={rightItemVariants}
            className="lg:col-span-7 bg-slate-900/30 backdrop-blur-xl border border-white/5 p-6 sm:p-10 rounded-2xl shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-100 rounded-2xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enterprise Corp"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="johndoe@enterprise.com"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States, Germany, UAE, KSA, Pakistan..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-all font-medium appearance-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="" disabled className="text-slate-700">
                      Select an Engineering Core
                    </option>
                    {serviceOptions.map((opt, i) => (
                      <option
                        key={i}
                        value={opt}
                        className="bg-[#0b0f19] text-white"
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Budget <span className="normal-case text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="Enter a budget if you have one"
                    maxLength="80"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Project Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Outline your architectural parameters, hardware constraints, system topology, or deployment scope details..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all font-medium resize-none"
                />
              </div>

              {submitError && (
                <p className="text-xs text-rose-400 font-medium">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-xs text-emerald-400 font-medium">
                  Request sent. We received your details by email and will reply
                  soon.
                </p>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{
                  scale: submitting ? 1 : 1.02,
                  boxShadow: "0 0 25px rgba(34,211,238,0.3)",
                }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-4 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 uppercase tracking-widest inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Book Free Consultation"}
                <FiArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-6 mt-6">
                <div className="flex items-center gap-2 text-slate-500">
                  <FiClock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    24hr Response
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FiShield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    NDA Available
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FiGlobe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    Global Clients
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FiLock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    Secure Data
                  </span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTAContactSection;
