"use client";

type Props = {
  roles?: {
    yogakaraka?: string[];
    maraka?: string[];
    badhaka?: string[];
    functionalBenefics?: string[];
    functionalMalefics?: string[];
  };
};

function labelClass() {
  return "text-xs font-medium uppercase tracking-wide text-slate-900";
}

function valueClass() {
  return "mt-1 text-sm text-slate-900";
}

function formatList(arr?: string[]) {
  if (!arr || !arr.length) return "—";
  return arr.join(", ");
}

export default function FunctionalRolesCard({ roles }: Props) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Functional Roles
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className={labelClass()}>Yogakaraka</div>
          <div className={valueClass()}>{formatList(roles?.yogakaraka)}</div>
        </div>
        <div>
          <div className={labelClass()}>Maraka</div>
          <div className={valueClass()}>{formatList(roles?.maraka)}</div>
        </div>
        <div>
          <div className={labelClass()}>Badhaka</div>
          <div className={valueClass()}>{formatList(roles?.badhaka)}</div>
        </div>
        <div>
          <div className={labelClass()}>Functional Benefics</div>
          <div className={valueClass()}>
            {formatList(roles?.functionalBenefics)}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className={labelClass()}>Functional Malefics</div>
          <div className={valueClass()}>
            {formatList(roles?.functionalMalefics)}
          </div>
        </div>
      </div>
    </div>
  );
}