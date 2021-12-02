const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
    runtimeCaching,
    mode: "production",
    register: true,
    buildExcludes: [/middleware-manifest\.json$/],
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_MAGENTO_URL).hostname],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      loader: "graphql-tag/loader",
    });

    return config;
  },
});
