/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  images: {
    domains: ['openweathermap.org'],
  },
};

export default nextConfig;