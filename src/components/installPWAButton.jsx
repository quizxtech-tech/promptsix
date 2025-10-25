
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
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInstalled = localStorage.getItem('pwa-installed') === 'true';
      const isDismissed = localStorage.getItem('pwa-dismissed') === 'true';
      return isStandalone || isInstalled || isDismissed;
    };

    // Register service worker
    const registerSW = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registered:', registration);
        }
      } catch (err) {
        console.error('ServiceWorker registration failed:', err);
      }
    };

    registerSW();
    setIsPWAInstalled(checkInstalled());

    // Check screen size (should be under 450px)
    const isMobileScreen = window.innerWidth < 450;
console.log('run')
    // Show install prompt after 10s on mobile if not already installed/dismissed
    const showTimer = setTimeout(() => {
      console.log(isMobileScreen, checkInstalled())
      if (isMobileScreen && !checkInstalled()) {
        setIsVisible(true);
      }
    }, 10000); // Show after 10 seconds

    // Auto-hide after 20 seconds (30s total from page load)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      console.log('autohide');
      
    }, 30000); // 10s delay + 20s display = 30s total

    // Handle install prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Install prompt ready');
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

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
      toast.error("PWA installation not supported on this device/browser");
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
        console.log('autohide2')
      } else {
        // User declined, treat as dismissed
        localStorage.setItem('pwa-dismissed', 'true');
        setIsVisible(false);
        console.log('user decline')
      }
      
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Installation failed:', err);
      toast.error('Installation failed. Please try again.');
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    // Store dismissal in localStorage so it doesn't show again
    localStorage.setItem('pwa-dismissed', 'true');
    setIsVisible(false);
    console.log('localstore')
  };

  const showOnPaths = ['/', '/quiz-play'].includes(router.pathname);
  
  // Don't render if not on allowed paths, already installed, or screen too large
  if (!showOnPaths || isPWAInstalled) return null;

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