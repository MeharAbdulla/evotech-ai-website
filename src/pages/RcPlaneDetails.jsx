import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import Seo from "../Components/Seo";
import { getRcPlaneBySlug } from "../data/rcPlanes";
import { absoluteUrl } from "../seo/siteConfig";

const WHATSAPP = "923217691508";

function formatUsd(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function RcPlaneDetails() {
  const { slug } = useParams();
  const plane = getRcPlaneBySlug(slug);
  const [activeImg, setActiveImg] = useState(0);

  if (!plane) {
    return (
      <section className="min-h-[60vh] bg-black text-slate-100 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-400">Plane not found.</p>
        <Link to="/rc-planes" className="text-sky-400 text-sm font-semibold">
          Back to RC airplanes
        </Link>
      </section>
    );
  }

  const images = plane.images?.length ? plane.images : [plane.thumbnail];
  const img = images[Math.min(activeImg, images.length - 1)];
  const path = `/rc-planes/${plane.slug}`;
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi Aeromek, I want to order: ${plane.name} (${formatUsd(plane.price_usd)}).`
  )}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plane.name,
    description: plane.meta_description || plane.short_description,
    image: images.map((u) => absoluteUrl(u)),
    brand: { "@type": "Brand", name: "Aeromek" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      priceCurrency: "USD",
      price: String(plane.price_usd),
      availability: plane.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <Seo
        title={plane.meta_title || `${plane.name} — Aeromek RC Airplane`}
        description={plane.meta_description || plane.short_description}
        path={path}
        image={absoluteUrl(plane.thumbnail)}
        jsonLd={productJsonLd}
      />

      <section className="relative min-h-screen bg-black text-slate-100 px-4 sm:px-6 pt-28 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            to="/rc-planes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 mb-8"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> All RC airplanes
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={img}
                  alt={plane.name}
                  className="w-full h-full object-contain p-6"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg border overflow-hidden bg-[#0a0a0a] ${
                        i === activeImg ? "border-sky-400" : "border-white/10"
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.35em] uppercase text-sky-400 mb-3">
                {plane.categories.join(" · ")}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {plane.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black text-sky-400 tracking-tight">
                  {formatUsd(plane.price_usd)}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">USD</span>
                {plane.in_stock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                    <FiCheckCircle className="w-3.5 h-3.5" /> In stock
                  </span>
                ) : null}
              </div>

              <p className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                {plane.short_description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-[#05070d] font-bold text-sm transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" /> Order on WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 hover:border-sky-400/40 text-slate-100 font-semibold text-sm transition-colors"
                >
                  Contact Aeromek
                </Link>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-4">
                  Specifications & details
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {plane.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
