// FILE: src/components/AscendantSection.tsx

import React from "react";

type PanchangInfo = {
  weekday: string;
  tithiName: string;
  yogaName: string;
  moonNakshatraName: string;
  moonNakshatraTheme?: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  rahuKaal?: string;
  gulikaKaal?: string;
  abhijitMuhurat?: string;
  festivalNote?: string;
  guidanceLine?: string;
};

export type AscendantData = {
  ascSign: string;
  ascNakshatraName: string;
  ascNakshatraKeywords?: string;

  moonSign?: string;
  moonNakshatraName?: string;
  moonNakshatraKeywords?: string;

  panchang?: PanchangInfo;
};

export function AscendantSection({ data }: { data: AscendantData }) {
  if (!data) return null;

  const {
    ascSign,
    ascNakshatraName,
    ascNakshatraKeywords,
    moonSign,
    moonNakshatraName,
    moonNakshatraKeywords,
    panchang,
  } = data;

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-slate-900">Ascendant</h2>

      <div className="rounded border border-slate-200 bg-white shadow-sm p-4 text-sm leading-relaxed text-slate-700">
        {/* Asc / Lagna block */}
        <div className="mb-4">
          <div className="text-slate-900 font-medium text-sm">
            {ascSign} Ascendant (Sidereal/Lahiri)
          </div>

          <div className="mt-2">
            <span className="font-semibold text-slate-800">
              Ascendant Nakshatra (Lagna star):
            </span>{" "}
            {ascNakshatraName}
            {ascNakshatraKeywords
              ? ` — ${ascNakshatraKeywords}`
              : ""}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            Your Lagna star describes how you move in the world — how you act,
            present yourself, manage situations, and try to stay in control.
            It’s the “outer strategy” people see.
          </div>
        </div>

        {/* Moon / Janma Nakshatra block */}
        {(moonSign || moonNakshatraName) && (
          <div className="mb-4">
            {moonSign && (
              <div className="text-slate-900 font-medium text-sm">
                Moon in {moonSign}
              </div>
            )}

            <div className="mt-2">
              <span className="font-semibold text-slate-800">
                Birth Nakshatra (Moon’s star / Janma Nakshatra):
              </span>{" "}
              {moonNakshatraName}
              {moonNakshatraKeywords
                ? ` — ${moonNakshatraKeywords}`
                : ""}
            </div>

            <div className="text-xs text-slate-500 mt-1">
              This is your emotional wiring, instinctive comfort zone, and the
              anchor for your Dasha timing. Most astrologers mean this when they
              say “your birth nakshatra.”
            </div>
          </div>
        )}

        {/* Panchang snapshot */}
        {panchang && (
          <div className="border-t border-slate-200 pt-4">
            <div className="text-slate-900 font-medium text-sm mb-2">
              Birth Panchang Snapshot
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-xs text-slate-700">
              <div>
                <dt className="font-semibold text-slate-800">Weekday</dt>
                <dd>{panchang.weekday}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-800">Tithi</dt>
                <dd>{panchang.tithiName}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-800">Yoga</dt>
                <dd>{panchang.yogaName}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-800">
                  Moon’s Nakshatra
                </dt>
                <dd>
                  {panchang.moonNakshatraName}
                  {panchang.moonNakshatraTheme
                    ? ` — ${panchang.moonNakshatraTheme}`
                    : ""}
                </dd>
              </div>

              {panchang.sunrise && panchang.sunset && (
                <div>
                  <dt className="font-semibold text-slate-800">
                    Sunrise / Sunset
                  </dt>
                  <dd>
                    {panchang.sunrise} / {panchang.sunset}
                  </dd>
                </div>
              )}

              {panchang.moonrise && panchang.moonset && (
                <div>
                  <dt className="font-semibold text-slate-800">
                    Moonrise / Moonset
                  </dt>
                  <dd>
                    {panchang.moonrise} / {panchang.moonset}
                  </dd>
                </div>
              )}

              {panchang.rahuKaal && (
                <div>
                  <dt className="font-semibold text-slate-800">Rahu Kaal</dt>
                  <dd>{panchang.rahuKaal}</dd>
                </div>
              )}

              {panchang.gulikaKaal && (
                <div>
                  <dt className="font-semibold text-slate-800">
                    Gulika Kaal
                  </dt>
                  <dd>{panchang.gulikaKaal}</dd>
                </div>
              )}

              {panchang.abhijitMuhurat && (
                <div>
                  <dt className="font-semibold text-slate-800">
                    Abhijit Muhurta
                  </dt>
                  <dd>{panchang.abhijitMuhurat}</dd>
                </div>
              )}
            </dl>

            {(panchang.festivalNote || panchang.guidanceLine) && (
              <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                {panchang.festivalNote && (
                  <div className="mb-1">
                    <span className="font-semibold text-slate-800">
                      Festival / Vrat:
                    </span>{" "}
                    {panchang.festivalNote}
                  </div>
                )}

                {panchang.guidanceLine && (
                  <div>
                    <span className="font-semibold text-slate-800">
                      Birth-day guidance:
                    </span>{" "}
                    {panchang.guidanceLine}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
