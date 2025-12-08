"use client";

import React from "react";

export type PanchangInfo = {
  weekday: string; // e.g. "Monday"
  tithiName: string; // e.g. "Dwitiya (Shukla)"
  yogaName: string; // e.g. "Siddhi"
  moonNakshatraName: string; // Moon's nakshatra at birth
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

export type AscendantCardProps = {
  ascSign: string; // "Virgo"
  ascNakshatraName: string; // e.g. "Hasta"
  ascNakshatraBlurb: string; // "craft, skill with hands, control through care"

  moonSign: string; // "Leo"
  moonNakshatraName: string; // e.g. "Magha"
  moonNakshatraBlurb: string; // "ancestry, status, legacy, royal pride"

  panchang: PanchangInfo | null;
};

export default function AscendantCard({
  ascSign,
  ascNakshatraName,
  ascNakshatraBlurb,
  moonSign,
  moonNakshatraName,
  moonNakshatraBlurb,
  panchang,
}: AscendantCardProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Ascendant</h2>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        {/* Ascendant / Lagna block */}
        <div className="mb-6">
          <div className="text-lg font-semibold text-slate-900">
            {ascSign} Ascendant (Sidereal / Lahiri)
          </div>

          <div className="text-slate-600 text-base mt-3 leading-relaxed">
            <div className="mb-2">
              <span className="font-medium text-slate-800">
                Ascendant Nakshatra (Lagna star):
              </span>{" "}
              {ascNakshatraName} — {ascNakshatraBlurb}
            </div>

            <div className="text-sm text-slate-500 leading-relaxed">
              This shows how you operate in the world — control style, how you
              “run your life,” how you manage situations. It’s your outer
              strategy and how people first read you.
            </div>
          </div>
        </div>

        {/* Moon / Janma Nakshatra block */}
        <div className="mb-6">
          <div className="text-lg font-semibold text-slate-900">
            Moon in {moonSign}
          </div>

          <div className="text-slate-600 text-base mt-3 leading-relaxed">
            <div className="mb-2">
              <span className="font-medium text-slate-800">
                Birth Nakshatra (Moon’s star / Janma Nakshatra):
              </span>{" "}
              {moonNakshatraName} — {moonNakshatraBlurb}
            </div>

            <div className="text-sm text-slate-500 leading-relaxed">
              This is your emotional wiring, instinctive comfort zone, and the
              anchor for your Dasha timeline. This is the one most astrologers
              mean by “your birth nakshatra.”
            </div>
          </div>
        </div>

        {/* Panchang snapshot */}
        {panchang && (
          <div className="border-t border-slate-200 pt-6">
            <div className="text-lg font-semibold text-slate-900 mb-2">
              Birth Panchang Snapshot
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-slate-700">
              <div>
                <dt className="font-medium text-slate-800">Weekday</dt>
                <dd>{panchang.weekday}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-800">Tithi</dt>
                <dd>{panchang.tithiName}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-800">Yoga</dt>
                <dd>{panchang.yogaName}</dd>
              </div>

              <div>
                <dt className="font-medium text-slate-800">
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
                  <dt className="font-medium text-slate-800">
                    Sunrise / Sunset
                  </dt>
                  <dd>
                    {panchang.sunrise} / {panchang.sunset}
                  </dd>
                </div>
              )}

              {panchang.moonrise && panchang.moonset && (
                <div>
                  <dt className="font-medium text-slate-800">
                    Moonrise / Moonset
                  </dt>
                  <dd>
                    {panchang.moonrise} / {panchang.moonset}
                  </dd>
                </div>
              )}

              {panchang.rahuKaal && (
                <div>
                  <dt className="font-medium text-slate-800">Rahu Kaal</dt>
                  <dd>{panchang.rahuKaal}</dd>
                </div>
              )}

              {panchang.gulikaKaal && (
                <div>
                  <dt className="font-medium text-slate-800">Gulika Kaal</dt>
                  <dd>{panchang.gulikaKaal}</dd>
                </div>
              )}

              {panchang.abhijitMuhurat && (
                <div>
                  <dt className="font-medium text-slate-800">
                    Abhijit Muhurta
                  </dt>
                  <dd>{panchang.abhijitMuhurat}</dd>
                </div>
              )}
            </dl>

            {(panchang.festivalNote || panchang.guidanceLine) && (
              <div className="mt-4 text-sm text-slate-600 leading-relaxed">
                {panchang.festivalNote && (
                  <div className="mb-1">
                    <span className="font-medium text-slate-800">
                      Festival / Vrat:
                    </span>{" "}
                    {panchang.festivalNote}
                  </div>
                )}

                {panchang.guidanceLine && (
                  <div>
                    <span className="font-medium text-slate-800">
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
