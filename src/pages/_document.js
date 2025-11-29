// ** React Import
import React from "react";

// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";

const CustomDocument = () => {
  return (
    <Html lang="en" version={process.env.NEXT_PUBLIC_WEB_CURRENT_VERSION}>
      <Head>
        {/* Google AdSense - MUST BE FIRST */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3759020577120040"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XMEVN4E8QF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XMEVN4E8QF', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#0090FF" />

        {/* Apple Touch Icon for iOS */}
        <link rel="apple-touch-icon" href="/placeholder.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"
        />

        {/* Dark mode initialization script to prevent flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for stored theme or system preference
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                
                // Apply theme immediately to prevent flashing
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default CustomDocument;