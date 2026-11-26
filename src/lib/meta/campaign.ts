const ALLOWED_CAMPAIGN_PARAMS = new Set([
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
]);

export function hasAllowedCampaignQuery(
  search: string
): boolean {
  if (!search) return true;

  if (search.length > 4096) return false;

  const params = new URLSearchParams(search);
  const seen = new Set<string>();

  for (const [key, value] of params.entries()) {
    if (
      !ALLOWED_CAMPAIGN_PARAMS.has(key) ||
      seen.has(key) ||
      value.length > 1024
    ) {
      return false;
    }

    seen.add(key);
  }

  return true;
}