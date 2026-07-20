import type { NextConfig } from "next";

const mediaRemotePattern = getMediaRemotePattern();

const nextConfig: NextConfig = {
  compress: true,
  images: {
    dangerouslyAllowSVG: false,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    remotePatterns: mediaRemotePattern ? [mediaRemotePattern] : [],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@fardad/config", "@fardad/types", "@fardad/ui", "@fardad/utils"],
};

export default nextConfig;

function getMediaRemotePattern() {
  const configuredOrigin = process.env.STOREFRONT_MEDIA_ORIGIN?.trim();

  if (!configuredOrigin) {
    return null;
  }

  let origin: URL;

  try {
    origin = new URL(configuredOrigin);
  } catch {
    throw new Error("STOREFRONT_MEDIA_ORIGIN must be an absolute HTTP(S) URL");
  }

  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash
  ) {
    throw new Error(
      "STOREFRONT_MEDIA_ORIGIN must not contain credentials, a query string, or a fragment",
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!isLoopbackHostname(origin.hostname)) {
      throw new Error("Development media must use an exact loopback origin");
    }
  } else if (origin.protocol !== "https:") {
    throw new Error("Production media must use HTTPS");
  }

  const basePath = origin.pathname.replace(/\/$/, "");

  return {
    hostname: origin.hostname,
    pathname: `${basePath}/public/media/**`,
    port: origin.port,
    protocol: origin.protocol.slice(0, -1) as "http" | "https",
    search: "",
  };
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
