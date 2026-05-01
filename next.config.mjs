/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgp.cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "wplhkaqvcwbjgzwixtzr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
