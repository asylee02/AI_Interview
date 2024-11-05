/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const config = {
  reactStrictMode: true,
  images: {
    domains: ['k.kakaocdn.net'],
  },
};
const webpack = {
  devServer: {
    port: 3000,
    open: false,
  },
};

const nextConfig = withPWA({
  dest: 'public',
})(config, webpack);

module.exports = nextConfig;
