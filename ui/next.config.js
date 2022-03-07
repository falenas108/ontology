/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
