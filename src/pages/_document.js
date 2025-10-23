// ** React Import
import React from "react";

// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";

const CustomDocument = () => {
  return (
    <Html lang="en" version={process.env.NEXT_PUBLIC_WEB_CURRENT_VERSION}>
      <Head>
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
        ></script>
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
        {/* set your adsense script url here */}
        {/* <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9667891148162497" crossorigin="anonymous"></script> --> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default CustomDocument;
