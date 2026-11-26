"use client";

const CONSENT_KEY = "sarathi_cookie_consent_v1";
const WITHDRAWAL_KEY = "sarathi_meta_withdrawal_pending";
const LOCK_NAME = "sarathi-meta-consent";

let pending: Promise<boolean> = Promise.resolve(true);
let revision = 0;

function hasPendingWithdrawal(): boolean {
  try {
    return localStorage.getItem(WITHDRAWAL_KEY) === "true";
  } catch {
    return true;
  }
}

function setPendingWithdrawal(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(WITHDRAWAL_KEY, "true");
    } else {
      localStorage.removeItem(WITHDRAWAL_KEY);
    }
  } catch {
    // Storage failure must not authorize tracking.
  }
}

function hasLocalMarketingConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return !!raw && JSON.parse(raw).marketing === true;
  } catch {
    return false;
  }
}

async function postConsent(marketing: boolean): Promise<boolean> {
  try {
    const response = await fetch("/api/meta/consent", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ marketing }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return false;

    const result = await response.json();

    return (
      result.success === true &&
      result.marketing === marketing
    );
  } catch {
    return false;
  }
}

async function withConsentLock(
  action: () => Promise<boolean>,
  marketing: boolean
): Promise<boolean> {
  if (
    typeof navigator !== "undefined" &&
    navigator.locks
  ) {
    try {
      return await navigator.locks.request(
        LOCK_NAME,
        { mode: "exclusive" },
        action
      );
    } catch {
      return false;
    }
  }

  // Never block a withdrawal because Web Locks
  // are unavailable.
  if (!marketing) {
    return action();
  }

  return false;
}

export async function waitForMetaConsentSync():
  Promise<boolean> {
  while (true) {
    const current = pending;
    const successful = await current.catch(() => false);

    if (current === pending) {
      return successful && !hasPendingWithdrawal();
    }
  }
}

export function syncMetaConsent(
  marketing: boolean
): Promise<boolean> {
  const currentRevision = ++revision;

  if (!marketing) {
    setPendingWithdrawal(true);
  }

  pending = pending
    .catch(() => false)
    .then(() =>
      withConsentLock(async () => {

        if (marketing) {
          if (
            currentRevision !== revision ||
            !hasLocalMarketingConsent()
          ) {
            return false;
          }

          if (hasPendingWithdrawal()) {
            const withdrawn = await postConsent(false);

            if (!withdrawn) return false;

            setPendingWithdrawal(false);
          }

          if (
            currentRevision !== revision ||
            !hasLocalMarketingConsent() ||
            hasPendingWithdrawal()
          ) {
            return false;
          }

          const granted = await postConsent(true);

          if (
            granted &&
            (
              currentRevision !== revision ||
              !hasLocalMarketingConsent() ||
              hasPendingWithdrawal()
            )
          ) {
            setPendingWithdrawal(true);

            const withdrawn = await postConsent(false);

            if (withdrawn) {
              setPendingWithdrawal(false);
            }

            return false;
          }

          return granted;
        }

        const withdrawn = await postConsent(false);

        if (withdrawn) {
          setPendingWithdrawal(false);
        }

        return withdrawn;

      }, marketing)
    );

  return pending;
}

export async function retryMetaWithdrawal():
  Promise<boolean> {
  if (!hasPendingWithdrawal()) return true;

  return syncMetaConsent(false);
}

export async function readServerMetaConsent():
  Promise<boolean> {
  if (
    hasPendingWithdrawal() ||
    !hasLocalMarketingConsent()
  ) {
    return false;
  }

  try {
    const response = await fetch("/api/meta/consent", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return false;

    const result = await response.json();

    return (
      result.marketing === true &&
      hasLocalMarketingConsent() &&
      !hasPendingWithdrawal()
    );
  } catch {
    return false;
  }
}