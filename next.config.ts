import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV === "development";

// Yandex Metrika (see `src/app/layout.tsx`): tag.js comes from mc.yandex.ru,
// hits and webvisor data go to mc.yandex.ru / mc.yandex.com over HTTPS and
// WebSocket; webvisor also frames mc.yandex.ru.
// https://yandex.ru/support/metrica/code/install-counter-csp.html
const metrikaScripts = "https://mc.yandex.ru https://mc.yandex.com https://yastatic.net";
const metrikaHosts = "https://mc.yandex.ru https://mc.yandex.com";
const metrikaSockets = "wss://mc.yandex.ru wss://mc.yandex.com";

// DialKit's dev panels import Geist Mono from Google Fonts. Blocking it makes every
// Fast Refresh fail to load their CSS and show an "undefined" runtime error.
const devFontStyles = isDevelopment ? " https://fonts.googleapis.com" : "";
const devFonts = isDevelopment ? " https://fonts.gstatic.com" : "";

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} ${metrikaScripts};
  style-src 'self' 'unsafe-inline'${devFontStyles};
  img-src 'self' blob: data: ${metrikaHosts};
  font-src 'self' data:${devFonts};
  media-src 'self' blob:;
  connect-src 'self' ${metrikaHosts} ${metrikaSockets};
  frame-src ${metrikaHosts};
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "credentialless",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// In dev, revalidate on every request so replaced images and videos show up
// after a reload instead of being served from a week-long browser cache.
const publicAssetCacheHeaders = [
  {
    key: "Cache-Control",
    value: isDevelopment
      ? "no-cache"
      : "public, max-age=604800, stale-while-revalidate=86400",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Morphs a home page cover into its case-study hero (see `CaseMorph`).
    viewTransition: true,
  },
  images: {
    // AVIF first: about a fifth smaller than WebP at the same quality setting;
    // browsers without AVIF still get WebP.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
    // The optimizer keeps resized copies in memory, so an image replaced under
    // the same name keeps showing the old version until a restart. Serve the
    // originals in dev; production still optimizes.
    unoptimized: isDevelopment,
  },
  turbopack: {
    root,
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/videos/:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/images/:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/svg/:path*",
        headers: publicAssetCacheHeaders,
      },
      {
        source: "/font/:path*",
        headers: publicAssetCacheHeaders,
      },
    ];
  },
};

export default nextConfig;
