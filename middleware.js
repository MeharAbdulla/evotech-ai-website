/**
 * Vercel Edge Middleware:
 * - Redirect www → apex (canonical host)
 * - Strip trailing slashes on SPA paths
 */
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};

export default async function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === "www.aeromek.com") {
    url.hostname = "aeromek.com";
    return Response.redirect(url.toString(), 308);
  }

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return Response.redirect(url.toString(), 308);
  }
}
