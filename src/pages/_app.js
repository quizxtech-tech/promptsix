// ** Store Imports
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "react-hot-toast";
import { Router } from "next/router";
import NProgress from "nprogress";
import InspectElement from "@/components/InspectElement/InspectElement";
import Routes from "@/components/ZoneGuard/Routes";
import language from "@/utils/language";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";

// CSS File Here
import "react-loading-skeleton/dist/skeleton.css";
import "react-tooltip/dist/react-tooltip.css";
// import '../../public/assets/css/style.css'
import "../style/global.css";

const queryClient = new QueryClient();

// ** Configure JSS & ClassName
const App = ({ Component, pageProps }) => {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });

  return (
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
  );
};

export default App;
