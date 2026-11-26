"use client";

import { hasAllowedCampaignQuery } from "@/lib/meta/campaign";

import { useEffect } from "react";

import {
  META_ACTION_EVENTS,
  type MetaDiscoveryEvent,
} from "@/lib/meta/events";

import {
  trackMetaDiscovery,
} from "@/lib/meta/discovery-client";

import {
  waitForMetaConsentSync,
} from "@/lib/meta/consent-client";

type Props = {
  page: "home" | "astrologers";
};

export default function MetaDiscoveryTracking({
  page,
}: Props) {
  useEffect(() => {
    const expectedPath =
      page === "home"
        ? "/sarathi"
        : "/sarathi/astrologers";

    let active = true;
    let pageTracked = false;
    let pricingTracked = false;
    let pricingVisible = false;

    function permitted(): boolean {
      try {
        const raw = localStorage.getItem(
          "sarathi_cookie_consent_v1"
        );

        return (
          active &&
          window.location.pathname.replace(/\/+$/, "") ===
            expectedPath &&
          hasAllowedCampaignQuery(window.location.search) &&
          !!raw &&
          JSON.parse(raw).marketing === true &&
          localStorage.getItem(
            "sarathi_meta_withdrawal_pending"
          ) !== "true"
        );
      } catch {
        return false;
      }
    }

    async function trackPage() {
      if (!permitted() || pageTracked) return;

      if (!(await waitForMetaConsentSync())) return;

      if (!permitted() || pageTracked) return;

      pageTracked = true;

      void trackMetaDiscovery("PageView");

      if (page === "astrologers") {
        void trackMetaDiscovery("ViewContent");
      }
    }

    async function trackPricing() {
      if (
        !permitted() ||
        !pricingVisible ||
        pricingTracked
      ) {
        return;
      }

      if (!(await waitForMetaConsentSync())) return;

      if (
        !permitted() ||
        !pricingVisible ||
        pricingTracked
      ) {
        return;
      }

      pricingTracked = true;

      void trackMetaDiscovery(
        "AstrologerPricingView"
      );
    }

    function onClick(event: MouseEvent) {
      if (!permitted()) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      const element = target.closest(
        "[data-sarathi-action]"
      );

      const action = element?.getAttribute(
        "data-sarathi-action"
      );

      if (
        !action ||
        !Object.prototype.hasOwnProperty.call(
          META_ACTION_EVENTS,
          action
        )
      ) {
        return;
      }

      const eventName =
        META_ACTION_EVENTS[
          action as keyof typeof META_ACTION_EVENTS
        ] as MetaDiscoveryEvent;

      void trackMetaDiscovery(eventName);
    }

    function onConsent() {
      void trackPage();
      void trackPricing();
    }

    document.addEventListener("click", onClick, true);

    window.addEventListener(
      "sarathi:consent-updated",
      onConsent
    );

    window.addEventListener("storage", onConsent);

    let observer: IntersectionObserver | undefined;

    if (
      page === "astrologers" &&
      "IntersectionObserver" in window
    ) {
      const pricing = document.querySelector(
        "#pricing h2"
      );

      if (pricing) {
        observer = new IntersectionObserver(
          (entries) => {
            pricingVisible = entries.some(
              (entry) =>
                entry.isIntersecting &&
                entry.intersectionRatio >= 0.5
            );

            if (pricingVisible) {
              void trackPricing();
            }
          },
          { threshold: 0.5 }
        );

        observer.observe(pricing);
      }
    }

    void trackPage();

    return () => {
      active = false;

      document.removeEventListener(
        "click",
        onClick,
        true
      );

      window.removeEventListener(
        "sarathi:consent-updated",
        onConsent
      );

      window.removeEventListener(
        "storage",
        onConsent
      );

      observer?.disconnect();
    };
  }, [page]);

  return null;
}