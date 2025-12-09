// FILE: src/types/tz-lookup.d.ts

declare module "tz-lookup" {
  /**
   * Returns an IANA timezone string (e.g. "Asia/Dubai")
   * for the given latitude and longitude.
   */
  export default function tzlookup(lat: number, lon: number): string;
}
