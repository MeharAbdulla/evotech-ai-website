import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiClock } from "react-icons/fi";
import blogService from "../services/blogService";
import MarkdownBody from "../Components/MarkdownBody";
import Seo from "../Components/Seo";
import { categoryToServiceSlugs, getServiceBySlug } from "../data/serviceLandings";
import { absoluteUrl } from "../seo/siteConfig";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await blogService.getPostBySlug(slug);
        setPost(data);
        try {
          const all = await blogService.getPosts();
          const list = Array.isArray(all) ? all : [];
          setRelated(
            list
              .filter(
                (p) =>
                  p.slug !== slug &&
                  (p.category === data.category ||
                    (data.keywords || []).some((k) =>
                      (p.keywords || []).includes(k)
                    ))
              )
              .slice(0, 3)
          );
        } catch {
          setRelated([]);
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Post not found");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const serviceSlugs =
    (post && categoryToServiceSlugs[post.category]) ||
    ["computer-vision", "yolo"];
  const relatedServices = serviceSlugs
    .map((s) => getServiceBySlug(s))
    .filter(Boolean)
    .slice(0, 3);

  const path = `/blog/${slug || ""}`;
  const coverImage =
    post?.cover_image &&
    (post.cover_image.startsWith("http")
      ? post.cover_image
      : absoluteUrl(post.cover_image));

  const jsonLd = post
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.meta_description || post.excerpt,
          datePublished: post.created_at,
          dateModified: post.updated_at || post.created_at,
          image: coverImage ? [coverImage] : undefined,
          author: { "@type": "Organization", name: "Aeromek AI" },
          publisher: {
            "@type": "Organization",
            name: "Aeromek AI",
            logo: {
              "@type": "ImageObject",
              url: "https://aeromek.com/logo-transparent.png",
            },
          },
          mainEntityOfPage: absoluteUrl(path),
          keywords: (post.keywords || []).join(", "),
        },
        {
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
              name: "Blog",
              item: "https://aeromek.com/blog",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: absoluteUrl(path),
            },
          ],
        },
      ]
    : null;

  return (
    <section className="relative min-h-screen bg-black text-slate-100 px-4 sm:px-6 pt-28 pb-24 overflow-hidden">
      {post && (
        <Seo
          title={post.meta_title || post.title}
          description={post.meta_description || post.excerpt || post.title}
          path={path}
          type="article"
          image={coverImage || undefined}
          jsonLd={jsonLd}
        />
      )}
      <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] rounded-full bg-sky-500/8 blur-[140px] pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <nav className="text-xs text-slate-500 mb-6 flex flex-wrap gap-2 items-center">
          <Link to="/" className="hover:text-sky-300">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-sky-300">
            Blog
          </Link>
          {post && (
            <>
              <span>/</span>
              <span className="text-slate-400 line-clamp-1">{post.title}</span>
            </>
          )}
        </nav>

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300 transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to blog
        </Link>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 text-rose-400 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        {!loading && post && (
          <article>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300">
                {post.category || "AI"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <FiClock className="w-3.5 h-3.5" /> {formatDate(post.created_at)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            {coverImage && (
              <figure className="mt-8 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={coverImage}
                  alt={post.cover_image_alt || post.title}
                  className="w-full max-h-[420px] object-cover"
                  loading="eager"
                />
              </figure>
            )}
            {(post.keywords || []).length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.keywords.slice(0, 8).map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-10 border-t border-white/10 pt-8">
              <MarkdownBody content={post.content} />
            </div>

            {relatedServices.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-white mb-3">Related services</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-sky-500/20 text-sky-300 hover:bg-sky-500/10 transition-colors"
                    >
                      {s.h1}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-white mb-3">Related articles</h2>
                <ul className="space-y-2">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="text-sm text-slate-300 hover:text-sky-300 transition-colors"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-12 p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5">
              <h2 className="text-lg font-bold text-white">
                Need this built for your workplace?
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Aeromek AI delivers computer vision, YOLO detection, embedded systems, IoT, and
                PCB design from concept to working systems you can pilot on site.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-sky-400 text-[#05070d] text-sm font-bold hover:bg-sky-300 transition-colors"
                >
                  Contact Aeromek
                </Link>
                <Link
                  to="/services/computer-vision"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/15 text-sm font-semibold text-slate-200 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
                >
                  Vision services
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
