const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
    mode: "production",
    register: true,
    buildExcludes: [/middleware-manifest\.json$/],
    disable: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [new URL("graphql", process.env.MAGENTO_URL).hostname],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/graphql/:pathname*",
        destination: new URL("graphql", process.env.MAGENTO_URL).href,
      },
      {
        source: "/:pathname*",
        destination: "/_url-resolver",
      },
    ];
  },
});
