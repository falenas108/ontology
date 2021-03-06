/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    runtime: 'nodejs',
    serverComponents: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/mabel',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
