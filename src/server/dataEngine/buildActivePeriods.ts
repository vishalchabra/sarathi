/**
 * Convert Data Engine Vimshottari timing into the
 * shared active-period format used by Sarathi products.
 *
 * This adapter does not calculate Dasha periods.
 * The Data Engine remains the source of timing data.
 */

export function buildActivePeriods(dasha: any) {
  const currentDasha = dasha?.current ?? null;

  if (!currentDasha) return null;

  return {
    mahadasha: currentDasha.md
      ? {
          lord: currentDasha.md,
          start: currentDasha.mdStartISO ?? null,
          end: currentDasha.mdEndISO ?? null,
          summary: "",
        }
      : null,

    antardasha: currentDasha.ad
      ? {
          mahaLord: currentDasha.md ?? "",
          subLord: currentDasha.ad,
          start: currentDasha.adStartISO ?? null,
          end: currentDasha.adEndISO ?? null,
        }
      : null,

    pratyantardasha: currentDasha.pd
      ? {
          mahaLord: currentDasha.md ?? "",
          antarLord: currentDasha.ad ?? "",
          lord: currentDasha.pd,
          start: currentDasha.pdStartISO ?? null,
          end: currentDasha.pdEndISO ?? null,
        }
      : null,
  };
}
