import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Use"
        description="Terms of use for aeromek.com — website content, project demos, and inquiry submissions."
        path="/terms"
      />
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="These terms govern use of the Aeromek AI website and public materials."
        ctaLabel="Contact us"
        ctaTo="/contact"
      />
      <section className="bg-black text-slate-300 px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-8 text-sm leading-relaxed">
          <p className="text-slate-500 text-xs uppercase tracking-wider">
            Last updated: 13 October 2026
          </p>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Website content</h2>
            <p>
              Content on aeromek.com — including service descriptions, blog articles, and
              portfolio demos — is provided for information and business inquiry purposes.
              Portfolio items labeled as demos or prototypes illustrate capabilities and are
              not a guarantee of identical results for every customer environment.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">No production warranty from demos</h2>
            <p>
              Public demos, videos, and project pages do not constitute a contractual
              commitment, certified production deployment, or quantified performance SLA
              unless separately agreed in writing.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Inquiries</h2>
            <p>
              Submitting a form or messaging Aeromek does not create a consulting engagement
              until both parties agree on scope and commercial terms.
            </p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a className="text-sky-400 hover:text-sky-300" href="mailto:aeromekai@gmail.com">
                aeromekai@gmail.com
              </a>{" "}
              ·{" "}
              <Link className="text-sky-400 hover:text-sky-300" to="/contact">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
