import type { NextConfig } from "next";

/**
 * Content-Security-Policy. Every page is built once and served as-is, so a
 * per-request nonce isn't possible without giving that up; Next's inline
 * bootstrap scripts are allowed instead. Dev mode also needs 'unsafe-eval'.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Case studies used to live at the root; keep old links working.
  async redirects() {
    return [
      { source: "/agency_brain", destination: "/work/agency-brain", permanent: true },
      { source: "/codexion", destination: "/work/codexion", permanent: true },
      { source: "/fly-in", destination: "/work/fly-in", permanent: true },
    ];
  },
};

export default nextConfig;
