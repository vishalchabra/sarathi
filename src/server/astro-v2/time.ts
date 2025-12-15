// Keep time handling *simple and consistent*.
// Astronomy Engine accepts JS Date. We'll always pass UTC Date objects.

export function toUtcDate(isoOrDate: string | Date): Date {
  if (isoOrDate instanceof Date) return isoOrDate;
  // IMPORTANT: must be ISO with timezone (or already UTC). Your code already uses ISO UTC in many places.
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${isoOrDate}`);
  }
  return d;
}
