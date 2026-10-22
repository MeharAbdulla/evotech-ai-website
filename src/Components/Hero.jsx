import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCompass } from "react-icons/fi";

const Hero = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowVideo(mq.matches && !reduce.matches);
    update();
    mq.addEventListener?.("change", update);
    reduce.addEventListener?.("change", update);
    return () => {
      mq.removeEventListener?.("change", update);
      reduce.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!allowVideo || !videoRef.current) return undefined;
    const el = videoRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowVideo]);

  return (
    <div
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#03050a] text-white font-sans antialiased pt-20 sm:pt-24 px-4 sm:px-6"
    >
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {allowVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src="/hero-background.mp4"
          poster="/hero-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setVideoReady(true)}
        />
      )}

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#03050a]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_transparent_0%,_rgba(0,0,0,0.35)_75%)]" />

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        <motion.img
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          src="/logo-transparent.png"
          alt="Aeromek AI"
          width={400}
          height={160}
          className="w-[200px] sm:w-[320px] md:w-[400px] h-auto object-contain mb-6 sm:mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold tracking-tight leading-[1.15] text-white max-w-3xl drop-shadow-[0_6px_28px_rgba(0,0,0,0.7)]"
        >
          Workplace vision AI that sees what matters
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-4 sm:mt-5 text-slate-200/95 text-sm sm:text-lg leading-relaxed max-w-2xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)] px-1"
        >
          Industrial computer vision and AI camera systems for factories, warehouses,
          and sites — object detection, inspection, and safety monitoring you can pilot
          on real cameras.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 flex flex-col sm:flex-row gap-3.5 items-center justify-center w-full sm:w-auto"
        >
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm px-8 py-4 rounded-xl shadow-[0_8px_32px_rgba(56,189,248,0.35)] transition-all duration-300 hover:-translate-y-0.5 group"
          >
            Discuss Your Computer Vision Project
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/services/computer-vision"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-sky-400/50 text-white font-semibold text-sm px-8 py-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <FiCompass className="w-4 h-4 text-sky-400" />
            Computer vision services
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
