"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CrmAccess = {
  loading: boolean;
  canRead: boolean;
  canWrite: boolean;
  error: string;
};

const initialAccess: CrmAccess = {
  loading: true,
  canRead: false,
  canWrite: false,
  error: "",
};

export function useCrmAccess() {
  const [access, setAccess] = useState<CrmAccess>(initialAccess);
  const requestId = useRef(0);

  const refresh = useCallback(async (blocking = true) => {
    const currentRequest = ++requestId.current;

    if (blocking) {
      setAccess(initialAccess);
    }

    try {
      const supabase = createClient();

      const [readResult, writeResult] = await Promise.all([
        supabase.rpc("crm_can_read"),
        supabase.rpc("crm_can_write"),
      ]);

      if (currentRequest !== requestId.current) return;

      if (readResult.error) throw readResult.error;
      if (writeResult.error) throw writeResult.error;

      const canRead = readResult.data === true;

      setAccess({
        loading: false,
        canRead,
        canWrite: canRead && writeResult.data === true,
        error: "",
      });
    } catch {
      if (currentRequest !== requestId.current) return;

      setAccess({
        loading: false,
        canRead: false,
        canWrite: false,
        error: "Unable to verify CRM access. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    void refresh();

    const onFocus = () => {
      void refresh(false);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh(false);
      }
    };

    window.addEventListener("focus", onFocus);

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh(false);
      }
    }, 60000);

    let authTimer: number | undefined;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "USER_UPDATED"
        ) {
          ++requestId.current;
          setAccess(initialAccess);

          window.clearTimeout(authTimer);

          authTimer = window.setTimeout(() => {
            void refresh();
          }, 0);
        }
      });

    return () => {
      ++requestId.current;

      window.clearInterval(interval);
      window.clearTimeout(authTimer);

      window.removeEventListener("focus", onFocus);

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );

      subscription.unsubscribe();
    };
  }, [refresh]);

  return { ...access, refresh };
}