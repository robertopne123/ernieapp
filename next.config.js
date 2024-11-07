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
  // output: "export",
};

module.exports = nextConfig;
