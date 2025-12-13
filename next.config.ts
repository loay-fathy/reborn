/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "swagger.quoril.space",
        port: "",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "swagger.quoril.space",
        port: "",
        pathname: "/**", // allow all paths over HTTPS too
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // When frontend requests /api/anything...
        destination: 'https://swagger.quoril.space/api/:path*', // ...send it to the backend.
      },
    ];
  },
};

module.exports = nextConfig;
