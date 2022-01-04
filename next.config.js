/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
      mode: 'production',
      register: true,
      buildExcludes: [/middleware-manifest\.json$/],
      disable: process.env.NODE_ENV === 'development',
    },
    reactStrictMode: true,
    images: {
      domains: [new URL(process.env.NEXT_PUBLIC_ADOBE_COMMERCE_URL).hostname],
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        loader: 'graphql-tag/loader',
      });

      return config;
    },
  }),
);
