import React from "react";
import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "../seo/siteConfig";

const EMAIL = "info@aeromek.com";
const PHONE_DISPLAY = "+1 5055288220";
const PHONE_TEL = "+15055288220";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | Software & Technology Services</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="og:title" content={`${SITE_NAME} | Software & Technology Services`} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:title" content={`${SITE_NAME} | Software & Technology Services`} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <div className="llc-page min-h-screen flex flex-col">
        <header className="llc-header">
          <div className="llc-wrap llc-header-inner">
            <a href="/" className="llc-brand" aria-label="Aeromek LLC home">
              <img src="/logo-transparent.png" alt="" className="llc-logo" />
              <span>Aeromek LLC</span>
            </a>
            <nav className="llc-nav" aria-label="Page">
              <a href="#about">About</a>
              <a href="#company">Company</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="llc-hero">
            <div className="llc-wrap">
              <p className="llc-kicker">Official company site</p>
              <h1>Aeromek LLC</h1>
              <p className="llc-lead">
                Software development, mobile and web applications, SaaS products,
                eSIM and travel connectivity services, and related technology
                services.
              </p>
              <div className="llc-cta">
                <a className="llc-btn llc-btn-primary" href={`mailto:${EMAIL}`}>
                  Email us
                </a>
                <a className="llc-btn llc-btn-ghost" href={`tel:${PHONE_TEL}`}>
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </section>

          <section id="about" className="llc-section">
            <div className="llc-wrap llc-grid">
              <div>
                <h2>About</h2>
                <p>
                  Aeromek LLC builds and delivers technology products and services
                  for businesses and travelers. Our work spans custom software,
                  mobile and web applications, SaaS platforms, and eSIM / travel
                  connectivity solutions.
                </p>
              </div>
              <div className="llc-card">
                <h3>Nature of business</h3>
                <ul>
                  <li>Software development</li>
                  <li>Mobile and web applications</li>
                  <li>SaaS products</li>
                  <li>eSIM / travel connectivity services</li>
                  <li>Related technology services</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="company" className="llc-section llc-section-alt">
            <div className="llc-wrap">
              <h2>Company details</h2>
              <dl className="llc-dl">
                <div>
                  <dt>Legal name</dt>
                  <dd>Aeromek LLC</dd>
                </div>
                <div>
                  <dt>Owner / director</dt>
                  <dd>Awais Murtaza — 100%</dd>
                </div>
              </dl>
            </div>
          </section>

          <section id="contact" className="llc-section">
            <div className="llc-wrap">
              <h2>Contact</h2>
              <div className="llc-contact-grid">
                <a className="llc-contact-item" href={`mailto:${EMAIL}`}>
                  <span className="llc-contact-label">Email</span>
                  <span className="llc-contact-value">{EMAIL}</span>
                </a>
                <a className="llc-contact-item" href={`tel:${PHONE_TEL}`}>
                  <span className="llc-contact-label">Phone</span>
                  <span className="llc-contact-value">{PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="llc-footer">
          <div className="llc-wrap llc-footer-inner">
            <span>© {new Date().getFullYear()} Aeromek LLC</span>
            <span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              {" · "}
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
