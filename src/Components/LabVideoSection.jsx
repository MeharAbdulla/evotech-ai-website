import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

/**
 * Full-bleed robotics lab video — loads near viewport; pauses when off-screen.
 */
export default function LabVideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    loadObserver.observe(el);
    return () => loadObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current || !sectionRef.current) return undefined;
    const video = videoRef.current;
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    playObserver.observe(sectionRef.current);
    return () => playObserver.disconnect();
  }, [shouldLoad]);

  return (
    <section
      ref={sectionRef}
      className="cv-section relative min-h-[55vh] sm:min-h-[70vh] flex items-center overflow-hidden bg-black"
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/media/robotics-lab.mp4"
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-sky-400 mb-4">
            Robotics R&amp;D Lab
          </p>
          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Built in the lab.
            <br />
            Proven in the field.
          </h2>
          <p className="mt-4 sm:mt-5 text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
            From manufacturing benches to flight tests — Aeromek AI designs, prototypes,
            and validates robotics systems in a real engineering environment.
          </p>
          <Link
            to="/about"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-sm transition-colors"
          >
            About our process <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
