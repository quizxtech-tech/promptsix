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
    
    // Detect device and browser
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isSamsungBrowser = /SamsungBrowser/.test(navigator.userAgent);
    
   

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInstalled = localStorage.getItem('pwa-installed') === 'true';
      const isDismissed = localStorage.getItem('pwa-dismissed') === 'true';
      const isIOSStandalone = window.navigator.standalone === true;
      
     
      
      return isStandalone || isInstalled || isDismissed || isIOSStandalone;
    };

    const installed = checkInstalled();
    setIsPWAInstalled(installed);

    if (installed) {
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


  

    // Check screen size
    const isMobileScreen = window.innerWidth < 450;

    if (!isMobileScreen) {
      return;
    }

    let showTimer;
    let hideTimer;

    // Handle install prompt - this is the key event
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show button after prompt is captured
      showTimer = setTimeout(() => {
        setIsVisible(true);
        
        // Auto-hide after 20 seconds
        // hideTimer = setTimeout(() => {
        //   setIsVisible(false);
        // }, 60000);
      }, 5000);
    };

    // Listen for the install prompt
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    
    
    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [router.pathname]);

  const handleInstallClick = async () => {
    
    // Check if browser supports PWA
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Handle iOS Safari
    if (isIOSDevice && isSafari) {
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
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('Installing app...');
        localStorage.setItem('pwa-installed', 'true');
        setIsPWAInstalled(true);
        setIsVisible(false);
      } else {
        localStorage.setItem('pwa-dismissed', 'true');
        setIsVisible(false);
      }
      
      setDeferredPrompt(null);
    } catch (err) {
      
      toast.error('Installation failed. Check console for details.');
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    console.log("✖️ User dismissed install prompt");
    localStorage.setItem('pwa-dismissed', 'true');
    setIsVisible(false);
  };

  const showOnPaths = ['/', '/category','/trending','/prompt-heroes'].includes(router.pathname);
  
  
  // Don't render if not on allowed paths or already installed
  if (!showOnPaths) {
    return null;
  }
  
  if (isPWAInstalled) {
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