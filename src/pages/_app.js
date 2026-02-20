// ** Store Imports
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "react-hot-toast";
import { Router, useRouter } from "next/router";
import NProgress from "nprogress";
import InspectElement from "@/components/InspectElement/InspectElement";
import Routes from "@/components/ZoneGuard/Routes";
import language from "@/utils/language";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from 'next/head';
import SEOHead from '@/components/SEO/SEOHead';
// CSS File Here
import "react-loading-skeleton/dist/skeleton.css";
import "react-tooltip/dist/react-tooltip.css";
// import '../../public/assets/css/style.css'
import "../style/global.css";
import * as gtag from '../../public/lib/gtag';
import { useEffect } from "react";

const queryClient = new QueryClient();

// ** Configure JSS & ClassName
const App = ({ Component, pageProps }) => {

  const router = useRouter();
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }

    // Track page views on route change
    router.events.on('routeChangeComplete', handleRouteChange)

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])


  return (

    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0090FF" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/placeholder.jpg" />
        <meta name="google-adsense-account" content="ca-pub-3759020577120040"></meta>
      </Head>

      {/* Render SEO if page provides seoData via pageProps */}
      {pageProps.seoData && pageProps.seoStructuredData && (
        <SEOHead
          {...pageProps.seoData}
          structuredData={pageProps.seoStructuredData}
        />
      )}

      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <I18nextProvider i18n={language}>
            <Toaster position="top-center" containerClassName="toast-custom" />
            <InspectElement>
              <Routes>
                <Component {...pageProps} />
              </Routes>
            </InspectElement>
          </I18nextProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
};

export default App;
