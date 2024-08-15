/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i0.wp.com", "ernie.london"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
        port: "",
        pathname: "/ernie-london/wp-content/**",
      },
    ],
    unoptimized: true,
  },
  env: {
    STRIPE_SECRET: process.env.NEXT_PUBLIC_STRIPE_SECRET,
  },
  output: "export",
};

module.exports = nextConfig;
