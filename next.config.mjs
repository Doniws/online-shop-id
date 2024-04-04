/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack : (config ) => {
    config.externals = [...config.externals , 'bcrypt'];
    return config;
  }
};

export default nextConfig;
