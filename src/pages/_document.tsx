import * as React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/*
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap"
          rel="stylesheet"
        />
        */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Vire is a concept storefront built with Next.js on the Adobe Commerce GraphQL API."
        />
        <link
          rel="preload"
          href="https://m.rasmuswikman.com/media/catalog/product/cache/3ec1b99e63e099d3fbf6399ed95d3dda/o/p/optimized-wb04-blue-0.jpg"
          as="image"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
