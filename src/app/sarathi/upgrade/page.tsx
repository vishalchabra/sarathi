import Link from "next/link";

export default function SarathiUpgradePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Upgrade</h1>
      <p className="text-slate-900">
        Choose your plan. (Placeholder page — wire payments later.)
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5">
          <div className="text-sm font-semibold text-slate-900">Advanced</div>
          <div className="mt-2 text-slate-900 text-sm">
            Deeper activations + decision playbook.
          </div>
          <div className="mt-4">
            <button className="rounded-xl bg-white/80 text-black px-4 py-2 font-medium">
              Coming soon
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5">
          <div className="text-sm font-semibold text-slate-900">Full Guidance</div>
          <div className="mt-2 text-slate-900 text-sm">
            Full timing map + full roadmap.
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-xl bg-white/80 text-black px-4 py-2 font-medium">
              Coming soon
            </button>
            <Link
              href="/sarathi/life-report?tab=full"
              className="rounded-xl border border-white/20 px-4 py-2 text-slate-900"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
