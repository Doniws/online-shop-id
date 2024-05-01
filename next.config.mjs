/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];
    return config;
  },
  images: {
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Menggunakan string tunggal
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Menggunakan string tunggal
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
