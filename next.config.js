/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "i0.wp.com"],
  },
  target: "serverless",
};

module.exports = nextConfig;
