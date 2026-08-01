"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register(
          "/sw.js",
          {
            scope: "/",
          }
        );

        console.log(
          "[PWA] Service worker registered:",
          registration.scope
        );
      } catch (error) {
        console.error(
          "[PWA] Service worker registration failed:",
          error
        );
      }
    }

    window.addEventListener("load", registerServiceWorker);

    return () => {
      window.removeEventListener(
        "load",
        registerServiceWorker
      );
    };
  }, []);

  return null;
}