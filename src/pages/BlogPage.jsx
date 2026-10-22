import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle, FiArrowRight, FiBookOpen } from "react-icons/fi";
import PageHero from "../Components/PageHero";
import Seo from "../Components/Seo";
import blogService from "../services/blogService";
import { absoluteUrl } from "../seo/siteConfig";

function coverImageUrl(post) {
  const raw = post?.cover_image;
  if (!raw) return "";
  return raw.startsWith("http") ? raw : absoluteUrl(raw);
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await blogService.getPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Seo
        title="Engineering Blog — Computer Vision & Embedded Systems"
        description="Practical articles on workplace computer vision, YOLO, OpenCV, IoT, ESP32, STM32, and PCB design from Aeromek AI."
        path="/blog"
      />
      <PageHero
        eyebrow="Blog"
        title="Engineering insights from Aeromek AI"
        description="Articles on workplace computer vision, object detection, embedded systems, and industrial AI — published throughout the day."
        ctaLabel="Start a project"
        ctaTo="/contact"
      />

      <section className="relative bg-black text-slate-100 px-4 sm:px-6 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-sky-500/8 blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs mb-8">
              <FiAlertCircle /> {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
              <FiBookOpen className="w-8 h-8" />
              <p className="text-xs font-mono uppercase tracking-widest">Posts coming soon</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.04, 0.24) }}
                >
                    <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-sky-400/40 transition-colors"
                  >
                    {coverImageUrl(post) ? (
                      <div className="relative h-40 bg-[#060a12] overflow-hidden">
                        <img
                          src={coverImageUrl(post)}
                          alt={post.cover_image_alt || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300">
                        {post.category || "AI"}
                      </span>
                      <span className="text-[11px] text-slate-500">{formatDate(post.created_at)}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-50 group-hover:text-sky-300 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                      Read article <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
