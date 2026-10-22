import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiCode,
  FiCpu,
  FiCloud,
  FiGlobe,
  FiLayers,
  FiZap,
  FiBox,
  FiEye,
  FiCamera,
} from "react-icons/fi";
import Seo from "../Components/Seo";
import NotFound from "./NotFound";
import {
  getServiceBySlug,
  getRelatedServices,
} from "../data/serviceLandings";
import { absoluteUrl } from "../seo/siteConfig";

const ICON_MAP = {
  FiCode,
  FiCpu,
  FiCloud,
  FiGlobe,
  FiLayers,
  FiZap,
  FiBox,
  FiEye,
  FiCamera,
};

export default function ServiceDetails() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return <NotFound />;
  }

  const Icon = ICON_MAP[service.icon] || FiLayers;
  const related = getRelatedServices(service.slug);
  const path = `/services/${service.slug}`;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: "Aeromek AI",
      url: "https://aeromek.com",
    },
    areaServed: "Worldwide",
    url: absoluteUrl(path),
  };

  const faqLd =
    service.faq?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://aeromek.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://aeromek.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.h1,
        item: absoluteUrl(path),
      },
    ],
  };

  return (
    <section className="relative min-h-screen bg-black text-slate-100 px-4 sm:px-6 pt-28 pb-24 overflow-hidden">
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        path={path}
        jsonLd={[serviceLd, faqLd, breadcrumbLd]}
      />
      <div className="absolute top-1/4 -right-20 w-[480px] h-[480px] rounded-full bg-sky-500/8 blur-[140px] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <nav className="text-xs text-slate-500 mb-8 flex flex-wrap gap-2 items-center">
          <Link to="/" className="hover:text-sky-300">
            Home
          </Link>
          <span>/</span>
          <Link to="/services" className="hover:text-sky-300">
            Services
          </Link>
          <span>/</span>
          <span className="text-slate-300">{service.h1}</span>
        </nav>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {service.h1}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
              {service.summary}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Problems we solve</h2>
            <ul className="space-y-3">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                  <FiCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Industries served</h2>
            <div className="flex flex-wrap gap-2">
              {service.industries.map((ind) => (
                <span
                  key={ind}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                >
                  {ind}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Benefits for your business</h2>
            <ul className="space-y-3">
              {service.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                  <FiCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          {service.faq?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
              <div className="space-y-4">
                {service.faq.map((item) => (
                  <div
                    key={item.q}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0a0a0a]"
                  >
                    <h3 className="text-sm font-bold text-white">{item.q}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Related services</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/services/${r.slug}`}
                    className="p-4 rounded-xl border border-white/10 hover:border-sky-400/40 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-sky-300">
                      {r.h1}
                    </span>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{service.cta}</h2>
              <p className="mt-1 text-sm text-slate-400">
                Tell us about your cameras, devices, or product — we will propose a practical path.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400 text-[#05070d] text-sm font-bold hover:bg-sky-300 transition-colors shrink-0"
            >
              Contact Aeromek <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-sm text-slate-500">
            See{" "}
            <Link to="/projects" className="text-sky-400 hover:text-sky-300">
              projects
            </Link>{" "}
            and our{" "}
            <Link to="/blog" className="text-sky-400 hover:text-sky-300">
              engineering blog
            </Link>{" "}
            for related work.
          </p>
        </div>
      </div>
    </section>
  );
}
