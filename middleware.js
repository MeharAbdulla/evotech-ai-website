/**
 * Vercel Edge Middleware:
 * - Redirect www → apex (canonical host)
 * - Serve crawler-friendly HTML for blog + service pages
 * Humans continue to the React SPA (same URL).
 */
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};

const BOT_RE =
  /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegrambot|duckduckbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot/i;

export default async function middleware(request) {
  const url = new URL(request.url);

  // Canonical host: www.aeromek.com → aeromek.com
  if (url.hostname === "www.aeromek.com") {
    url.hostname = "aeromek.com";
    return Response.redirect(url.toString(), 308);
  }

  // Strip trailing slash on SPA pages only (matcher excludes /api — FastAPI needs slash)
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return Response.redirect(url.toString(), 308);
  }

  const ua = request.headers.get("user-agent") || "";
  if (!BOT_RE.test(ua)) {
    return; // continue to SPA
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return;
  }

  const [section, slug] = parts;
  if (!slug || slug.includes(".")) {
    return;
  }

  let apiPath = null;
  if (section === "blog") {
    apiPath = `/api/seo/blog/${encodeURIComponent(slug)}`;
  } else if (section === "services") {
    apiPath = `/api/seo/service/${encodeURIComponent(slug)}`;
  } else {
    return;
  }

  const apiUrl = new URL(apiPath, url.origin);
  try {
    const upstream = await fetch(apiUrl.toString(), {
      headers: { Accept: "text/html" },
    });
    if (!upstream.ok) {
      return;
    }
    const body = await upstream.text();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "index, follow",
        "cache-control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch {
    return;
  }
}
