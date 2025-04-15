/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["4acbt7lbir1rsx1d.public.blob.vercel-storage.com"],
  },
  async rewrites() {
    return [
      {
        source: "/:path*", // 👈 Any call to /api/* on frontend
        destination: "https://interview-api-production.up.railway.app/:path*", // 👉 will be proxied to Railway
      },
    ];
  },
};

module.exports = nextConfig;
