"use client";

import { useEffect, useState } from "react";

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  autoUpdateEnabled: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    autoUpdateEnabled: true, // Default to enabled
    hasUpdate: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone === true;

    setPwaState((prev) => ({
      ...prev,
      isInstalled: isStandalone || (isIOS && isInStandaloneMode),
    }));

    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("SW registered: ", registration);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  if (pwaState.autoUpdateEnabled) {
                    // Auto-update: skip waiting and reload
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  } else {
                    setPwaState((prev) => ({ ...prev, hasUpdate: true }));
                  }
                }
              });
            }
          });
        } catch (registrationError) {
          console.log("SW registration failed: ", registrationError);
        }
      });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaState((prev) => ({ ...prev, isInstallable: true }));
    };

    // Handle app installed
    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
      setDeferredPrompt(null);
    };

    // Handle online/offline status
    const handleOnline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: false }));

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setPwaState((prev) => ({ ...prev, isInstallable: false }));
    }
  };

  const updateApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      });
    }
  };

  const toggleAutoUpdate = () => {
    setPwaState((prev) => ({
      ...prev,
      autoUpdateEnabled: !prev.autoUpdateEnabled,
    }));
  };

  const checkForUpdates = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  // Request notification permission (disabled for now)
  const requestNotificationPermission = async () => {
    // Push notifications are disabled
    console.log("Push notifications are currently disabled");
    return false;
  };

  // Subscribe to push notifications (disabled for now)
  const subscribeToPush = async () => {
    // Push notifications are disabled
    console.log("Push notifications are currently disabled");
    return null;
  };

  // Share content
  const shareContent = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      // Fallback to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          alert("הקישור הועתק ללוח");
        } catch (error) {
          console.error("Error copying to clipboard:", error);
        }
      }
    }
  };

  // Get app info
  const getAppInfo = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        return new Promise((resolve) => {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data);
          };
          registration.active?.postMessage({ type: "GET_VERSION" }, [
            messageChannel.port2,
          ]);
        });
      }
    } catch (error) {
      console.error("Error getting app info:", error);
    }
    return null;
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
    checkForUpdates,
    requestNotificationPermission,
    toggleAutoUpdate,
    subscribeToPush,
    shareContent,
    getAppInfo,
  };
};
