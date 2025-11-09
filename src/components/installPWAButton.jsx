import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("=== PWA Installation Component Initialized ===");
    console.log("Current Path:", router.pathname);
    console.log("User Agent:", navigator.userAgent);
    console.log("Screen Width:", window.innerWidth);
    
    // Detect device and browser
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);
    
    console.log("Device Detection:", {
      isIOSDevice,
      isSafari,
      isAndroid,
      isChrome,
      isFirefox,
      isEdge,
      isSamsungBrowser
    });

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInstalled = localStorage.getItem('pwa-installed') === 'true';
      const isDismissed = localStorage.getItem('pwa-dismissed') === 'true';
      const isIOSStandalone = window.navigator.standalone === true;
      
      console.log("Installation Status Check:", {
        isStandalone,
        isInstalled,
        isDismissed,
        isIOSStandalone
      });
      
      return isStandalone || isInstalled || isDismissed || isIOSStandalone;
    };

    const installed = checkInstalled();
    setIsPWAInstalled(installed);

    if (installed) {
      console.log("❌ PWA Button will NOT show - App already installed or dismissed");
      return;
    }

    // Check if browser likely supports PWA installation
    const browserSupportsInstall = (isAndroid && (isChrome || isEdge || isSamsungBrowser)) || 
                                   (isIOSDevice && isSafari);
    
    if (!browserSupportsInstall) {
      if (isFirefox) {
        console.log("❌ PWA Button will NOT show - Firefox doesn't support PWA installation prompts");
      } else if (isIOSDevice && !isSafari) {
        console.log("❌ PWA Button will NOT show - iOS only supports PWA in Safari");
      } else if (!isAndroid && !isIOSDevice) {
        console.log("❌ PWA Button will NOT show - Desktop/unsupported device");
      } else {
        console.log("❌ PWA Button will NOT show - Browser doesn't support beforeinstallprompt");
      }
      return;
    }

    console.log("✅ Browser potentially supports PWA installation");

    // Note: Service worker registration removed
    // Using manifest.json only for basic PWA support
    console.log('ℹ️ Running without service worker (manifest-only PWA)');

    // Check screen size
    const isMobileScreen = window.innerWidth < 450;
    console.log("Mobile Screen Check:", isMobileScreen, `(${window.innerWidth}px)`);

    if (!isMobileScreen) {
      console.log("❌ PWA Button will NOT show - Screen too large (desktop)");
      return;
    }

    let showTimer;
    let hideTimer;

    // Handle install prompt - this is the key event
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      console.log("🎉 beforeinstallprompt event FIRED - PWA is installable!");
      setDeferredPrompt(e);
      
      // Show button after prompt is captured
      console.log("⏰ Starting 10-second timer before showing install button...");
      showTimer = setTimeout(() => {
        console.log("✅ Showing PWA Install Button");
        setIsVisible(true);
        
        // Auto-hide after 20 seconds
        hideTimer = setTimeout(() => {
          console.log("⏰ Auto-hiding PWA button after 20 seconds");
          setIsVisible(false);
        }, 20000);
      }, 10000);
    };

    // Listen for the install prompt
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    console.log("👂 Listening for 'beforeinstallprompt' event...");

    // Timeout check - if event doesn't fire in 15 seconds, log why
    const eventTimeoutCheck = setTimeout(() => {
      if (!deferredPrompt) {
        console.log("⚠️ 'beforeinstallprompt' event did NOT fire after 15 seconds");
        console.log("Possible reasons:");
        console.log("  1. PWA criteria not met:");
        console.log("     - Missing or invalid manifest.json");
        console.log("     - Service worker not properly registered");
        console.log("     - Not served over HTTPS (except localhost)");
        console.log("     - Missing required manifest fields (name, icons, start_url, display)");
        console.log("  2. App is already installed");
        console.log("  3. User previously dismissed/installed from browser");
        console.log("  4. Browser doesn't support beforeinstallprompt");
        console.log("\n🔍 Check browser console for manifest/SW errors");
        console.log("🔍 Visit chrome://flags and search for 'PWA' settings");
      }
    }, 15000);
    
    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      clearTimeout(eventTimeoutCheck);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      console.log("🧹 Cleanup: Removed event listeners and timers");
    };
  }, [router.pathname]);

  const handleInstallClick = async () => {
    console.log("🖱️ Install button clicked");
    
    // Check if browser supports PWA
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Handle iOS Safari
    if (isIOSDevice && isSafari) {
      console.log("📱 iOS Safari detected - Showing manual install instructions");
      toast.info('Tap the share button and select "Add to Home Screen"');
      return;
    }

    // Handle other browsers
    if (!deferredPrompt) {
      console.error("❌ Installation failed: deferredPrompt is null");
      console.error("This means 'beforeinstallprompt' event never fired");
      console.error("Possible reasons:");
      console.error("  - PWA manifest is missing or invalid");
      console.error("  - Service worker registration failed");
      console.error("  - App doesn't meet PWA criteria");
      console.error("  - Browser doesn't support PWA installation");
      console.error("  - App is already installed");
      
      toast.error("Installation not available. Check console for details.");
      return;
    }

    try {
      console.log("📲 Triggering install prompt...");
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice outcome:", outcome);
      
      if (outcome === 'accepted') {
        console.log("✅ User accepted installation");
        toast.success('Installing app...');
        localStorage.setItem('pwa-installed', 'true');
        setIsPWAInstalled(true);
        setIsVisible(false);
      } else {
        console.log("❌ User declined installation");
        localStorage.setItem('pwa-dismissed', 'true');
        setIsVisible(false);
      }
      
      setDeferredPrompt(null);
    } catch (err) {
      console.error('❌ Installation error:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      toast.error('Installation failed. Check console for details.');
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    console.log("✖️ User dismissed install prompt");
    localStorage.setItem('pwa-dismissed', 'true');
    setIsVisible(false);
  };

  const showOnPaths = ['/', '/quiz-play'].includes(router.pathname);
  
  // Don't render if not on allowed paths or already installed
  if (!showOnPaths) {
    console.log("❌ PWA Button not rendered - Not on allowed path:", router.pathname);
    return null;
  }
  
  if (isPWAInstalled) {
    console.log("❌ PWA Button not rendered - App already installed/dismissed");
    return null;
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="relative">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-primary-color text-white rounded-lg shadow-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <span className="text-xl">📲</span>
              Install App
            </button>
            <button 
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 shadow-md transition-colors"
              aria-label="Close"
            >
              <IoMdClose size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}