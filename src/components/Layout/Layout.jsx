"use client";
import { useEffect, useState, useRef } from "react";
import { websettingsData } from "@/store/reducers/webSettings";
import {
  settingsConfigurationSucess,
  settingsSucess,
  sysConfigdata,
} from "@/store/reducers/settingsSlice";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Meta from "../SEO/Meta";
import {
  homeReceived,
  homeRequestFailed,
  homeUpdateLanguage,
} from "@/store/reducers/homeSlice";
import isQuizEnabled from "@/checkquiz/CheckQuizEnabled";
import {
  getSettingsApi,
  getSystemConfigurationsApi,
  getWebHomeSettingsApi,
} from "@/api/apiRoutes";
import { store } from "@/store/store";
import PushNotificationLayout from "../FirebaseNotification/FirebaseNotification";
import toast from "react-hot-toast";
import { IoHomeOutline, IoGridOutline, IoFlameOutline, IoPeopleCircleOutline, IoClose } from "react-icons/io5";
const TopHeader = dynamic(() => import("../NavBar/TopHeader"), { ssr: false });
const Header = dynamic(() => import("./Header"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });
import Image from "next/image";
import darkModeStar from "../../assets/images/darkModeStar.png";

const Layout = ({ children }) => {
  const navigate = useRouter();
  const pathname = usePathname();

  const [redirect, setRedirect] = useState(false);

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const webSettings = useSelector(websettingsData);

  const dispatch = useDispatch();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaButton, setShowPwaButton] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const currentPath = pathname || "/";

  const navItems = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: IoHomeOutline,
      active: currentPath === "/" || currentPath.startsWith("/home"),
    },
    {
      key: "category",
      label: "Category",
      href: "/category",
      icon: IoGridOutline,
      active: currentPath.startsWith("/category"),
    },
    {
      key: "trending",
      label: "Trending",
      href: "/trending",
      icon: IoFlameOutline,
      active: currentPath.startsWith("/trending"),
    },
    {
      key: "heroes",
      label: "Heroes",
      href: "/prompt-heroes",
      icon: IoPeopleCircleOutline,
      active: currentPath.startsWith("/prompt-heroes"),
    },
  ];

  const handleClosePwaButton = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowPwaButton(false);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choiceResult?.outcome === "accepted") {
        setIsPwaInstalled(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("pwaInstalled", "true");
        }
        handleClosePwaButton();
      }
    } else {
      toast.error("Your device does not support installing this app.");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("manualRefresh_Home", "true");
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const checkInstallationStatus = () => {
      const installedViaStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
      const storedFlag = localStorage.getItem("pwaInstalled") === "true";
      if (installedViaStandalone || storedFlag) {
        setIsPwaInstalled(true);
      }
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      localStorage.setItem("pwaInstalled", "true");
      setDeferredPrompt(null);
      handleClosePwaButton();
      toast.success("App installed successfully.");
    };

    checkInstallationStatus();
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    const isEligibleForPwa =
      currentPath === "/" ||
      currentPath.startsWith("/home") ||
      currentPath.startsWith("/category");
    if (isEligibleForPwa) {
      showTimerRef.current = setTimeout(() => {
        setShowPwaButton(true);
        hideTimerRef.current = setTimeout(() => {
          setShowPwaButton(false);
          hideTimerRef.current = null;
        }, 20000000);
      }, 20);
    } else {
      setShowPwaButton(false);
    }
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [currentPath]);
  

  useEffect(() => {
    const state = store.getState();
    const { currentLanguage } = store.getState().Languages;
    const { lastFetch, Lang } = state.Home;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    const firstLoad = sessionStorage.getItem("firstLoad_Home");
    const manualRefresh = sessionStorage.getItem("manualRefresh_Home");
    // If API data is fetched within last 10 minutes then don't call the API again
    const shouldFetchData = !firstLoad || manualRefresh === "true";

    const getHomeData = async () => {
      const response = await getWebHomeSettingsApi({});

      if (!response?.error) {
        dispatch(homeUpdateLanguage(selectcurrentLanguage.id));
        dispatch(homeReceived(response));
        sessionStorage.setItem("lastFetch_Home", Date.now());
      }

      if (response.error) {
        dispatch(homeRequestFailed(response));
        dispatch(homeUpdateLanguage(""));
      }
    };
    if (
      currentLanguage?.id != Lang?.language_id ||
      diffInMinutes > 10 ||
      shouldFetchData
    ) {
      getHomeData();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Home");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Home", "true");
  }, [selectcurrentLanguage]);

  // all settings data
  useEffect(() => {
    const getSettings = async () => {
      const response = await getSettingsApi({ type: "" });
      if (!response?.error) {
        sessionStorage.setItem("lastFetch_Settings", Date.now());
        dispatch(settingsSucess(response));
      }

      if (response.error) {
        console.error(response);
      }
    };

    const firstLoad = sessionStorage.getItem("firstLoad_Settings");
    const manualRefresh = sessionStorage.getItem("manualRefresh_Settings");
    // If API data is fetched within last 10 minutes then don't call the API again
    const shouldFetchData = !firstLoad || manualRefresh === "true";
    if (shouldFetchData) {
      getSettings();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Settings");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Settings", "true");
  }, []);

  useEffect(() => {
    const firstLoadSysConfig = sessionStorage.getItem(
      "firstLoad_Settings_Config"
    );
    const manualRefreshSysConfig = sessionStorage.getItem(
      "manualRefresh_Settings_Config"
    );

    const shouldFetchDataResponse =
      !firstLoadSysConfig || manualRefreshSysConfig === "true";

    const getSystemConfig = async () => {
      const sysConfig = await getSystemConfigurationsApi();
      if (sysConfig) {
        sessionStorage.setItem("lastFetch_Settings_Config", Date.now());
        dispatch(settingsConfigurationSucess(sysConfig));
      }
    };

    if (shouldFetchDataResponse) {
      getSystemConfig();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_Settings_Config");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_Settings_Config", "true");
  }, []);

  // Maintainance Mode
  const getsysData = useSelector(sysConfigdata);

  useEffect(() => {
    if (getsysData && getsysData.app_maintenance === "1") {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  }, [getsysData?.app_maintenance]);

  // Function to handle navigation to maintenance page
  const handleMaintenanceRedirect = () => {
    navigate.push("/maintenance");
  };

  useEffect(() => {
    if (redirect) {
      handleMaintenanceRedirect(); // Trigger the navigation outside the JSX
    }
  }, [redirect]);

  useEffect(() => {
    // Initialize theme from localStorage
    const storedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;


    const primaryColor =
      webSettings && webSettings?.primary_color
        ? storedTheme === "dark" ? process.env.NEXT_PUBLIC_DARK_MODE_PRIMARY_COLOR : webSettings && webSettings?.primary_color
        : "#EF5388FF";

    const secondaryColor =
      webSettings && webSettings?.footer_color
        ? storedTheme === "dark"
          ? "linear-gradient(180deg, rgba(255, 255, 255, 0.0512) 0%, rgba(255, 255, 255, 0.1024) 100%)"
          : webSettings?.footer_color
        : "#090029FF";

    // Set primary and secondary colors for any theme
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondaryColor
    );

    // Set primary-light color (a lighter version of primary color)
    document.documentElement.style.setProperty(
      "--primary-light",
      "#f7ccdd" // Light pink that matches the SVG background
    );

    // Set dark mode specific CSS variables
    if (storedTheme === "dark") {
      // Ensure dark mode colors are properly visible in dark theme
      document.documentElement.style.setProperty(
        "--dark-primary-color",
        primaryColor
      );
      document.documentElement.style.setProperty(
        "--dark-secondary-color",
        secondaryColor
      );
      document.documentElement.style.setProperty(
        "--primary-light",
        "#f7ccdd" // Keep the same light color in dark mode
      );
    }
  }, [webSettings]);

  // this function is for primary color gradient
  const primaryColor = document.documentElement.style.getPropertyValue("--primary-color");
  
  useEffect(() => {
    if (primaryColor) {
      const hsl = hexToHSL(primaryColor);
      const lightHex = hslToHex(hsl.h, hsl.s, Math.min(hsl.s + 15, 100));
      const darkHex = hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 35, 0));
      
      document.documentElement.style.setProperty('--gradient-from', lightHex);
      document.documentElement.style.setProperty('--gradient-to', darkHex);
    }
  }, [primaryColor]);

  function hexToHSL(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
  
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  
    return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  return (
    <PushNotificationLayout>
      <main className="main overflow-hidden pb-24 md:pb-0">
        <div className="hidden dark:block">
        </div>
        <Meta />
        <TopHeader />
        <Header />
        {children}
        <Footer />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_12px_rgba(15,23,42,0.12)] md:hidden">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate.push(item.href)}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors ${item.active ? "text-purple-600" : "text-slate-500"}`}
              >
                <Icon className="h-6 w-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      {showPwaButton && (
        <div className="fixed right-4 bottom-28 z-50 md:hidden">
          <div className="relative">
            <button
              type="button"
              onClick={handleClosePwaButton}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white"
              aria-label="Dismiss install prompt"
            >
              <IoClose className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleInstallPwa}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
            >
              Install App
            </button>
          </div>
        </div>
      )}
    </PushNotificationLayout>
  );
};
export default isQuizEnabled(Layout);
