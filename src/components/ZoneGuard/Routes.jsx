"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RiseLoader } from "react-spinners";
import { authRoutes, protectedRoutes } from "@/routes/routes";
import {
  webSettingsSuccess,
} from "@/store/reducers/webSettings";
import { getWebSettingsApi } from "@/api/apiRoutes";

// Define allowed routes
const allowedRoutes = [
  '/',
  '/home',
  '/instruction',
  '/contact-us',
  '/about-us',
  '/terms-conditions',
  '/privacy-policy',
];

const Routes = ({ children }) => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.User);

  // Check if the user is authenticated based on the presence of the token
  const isAuthenticated = userData.token;

  const navigate = useRouter();

  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  // Check if the given pathname matches any of the patterns
  const isRouteProtected = (pathname) => {
    return (
      pathname &&
      protectedRoutes.some((pattern) => pathname.startsWith(pattern))
    );
  };

  // Check if route is allowed
  const isRouteAllowed = (pathname) => {
    if (!pathname) return false;

    // Check if it's an exact match with allowed routes
    const exactMatch = allowedRoutes.some(route => 
      pathname === route || pathname === `${route}/`
    );
    
    if (exactMatch) return true;

    // Check if it starts with /trending/ or /category/
    if (pathname.startsWith('/trending/') || pathname.startsWith('/category/')) {
      return true;
    }

    return false;
  };

  // Check if the current route requires authentication
  const requiresAuth = isRouteProtected(pathname);

  useEffect(() => {
    const firstLoad = sessionStorage.getItem("firstLoad_WebSettings_Config");
    const manualRefresh = sessionStorage.getItem(
      "manualRefresh_WebSettings_Config"
    );
    const shouldFetchData = !firstLoad || manualRefresh === "true";

    const getWebSettingsData = async () => {
      const response = await getWebSettingsApi();
      if (!response?.error) {
        setLoading(false);
        dispatch(webSettingsSuccess(response));
        sessionStorage.setItem("lastFetch_Settings", Date.now());
      }
    };
    if (shouldFetchData) {
      getWebSettingsData();
    }

    // Clear manualRefresh flag
    sessionStorage.removeItem("manualRefresh_WebSettings_Config");

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem("firstLoad_WebSettings_Config", "true");
  }, [loading]);

  useEffect(() => {
    authCheck();
  }, [requiresAuth, pathname]);

  const authCheck = () => {
    if (requiresAuth) {
      if (isAuthenticated === null) {
        navigate.push("/auth/login");
        toast.error("Please login first");
        return;
      }
    }
  };

  // Check if the current route is an authentication route
  const isAuthRoute = authRoutes.includes(pathname);

  useEffect(() => {
    notAccessAfterLogin();
  }, [isAuthRoute]);

  const notAccessAfterLogin = () => {
    if (isAuthenticated) {
      if (isAuthRoute) {
        navigate.push("/");
      }
    }
  };

  // Check route accessibility
  useEffect(() => {
    if (!loading && pathname) {
      const allowed = isRouteAllowed(pathname);
      
      if (!allowed) {
        // navigate.push("/");
        // toast.error("Access denied. Redirecting to home.");
      }
    }
  }, [pathname, loading]);

  const loaderstyles = {
    loader: {
      textAlign: "center",
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    img: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  };

  return (
    <div>
      {loading ? (
        <Suspense fallback>
          <div className="loader" style={loaderstyles.loader}>
            <RiseLoader className="inner_loader" style={loaderstyles.img} />
          </div>
        </Suspense>
      ) : (
        children
      )}
    </div>
  );
};

export default Routes;