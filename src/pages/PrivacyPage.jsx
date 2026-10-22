import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Aeromek AI collects and uses information submitted through aeromek.com contact forms and related services."
        path="/privacy"
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This policy describes how Aeromek AI handles information submitted through this website."
        ctaLabel="Contact us"
        ctaTo="/contact"
      />
      <section className="bg-black text-slate-300 px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-8 text-sm leading-relaxed">
          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Last updated: 13 October 2026
          </p>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Information we collect</h2>
            <p>
              When you submit a consultation or contact form, we may collect your name,
              company name, email address, phone number, country, project description, and
              related fields you choose to provide. Technical logs from hosting providers
              (such as IP address and request metadata) may also be processed automatically
              by our deployment platform.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">How we use information</h2>
            <p>
              We use submitted information to respond to inquiries, discuss project scope,
              and operate the website. We do not sell personal information. Lead records
              may be stored in our database and reviewed by authorized Aeromek staff.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">WhatsApp and email</h2>
            <p>
              After a successful form submission, you may be redirected to WhatsApp with a
              pre-filled message based on the details you entered. Email links on this site
              open your mail client; messaging through those channels is subject to the
              privacy practices of those providers.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Analytics</h2>
            <p>
              If analytics tools are enabled (for example Google Analytics or Vercel Analytics),
              they may collect aggregated usage data such as pages viewed. We avoid sending
              full form field contents to analytics events.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Contact</h2>
            <p>
              For privacy questions, contact{" "}
              <a className="text-sky-400 hover:text-sky-300" href="mailto:aeromekai@gmail.com">
                aeromekai@gmail.com
              </a>{" "}
              or use the{" "}
              <Link className="text-sky-400 hover:text-sky-300" to="/contact">
                contact form
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
