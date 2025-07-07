/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['4acbt7lbir1rsx1d.public.blob.vercel-storage.com', 'storage.googleapis.com', 'pexels.com'],
  },
};

module.exports = nextConfig;
