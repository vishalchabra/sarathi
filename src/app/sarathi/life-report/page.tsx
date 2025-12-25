// FILE: src/app/sarathi/life-report/page.tsx

import TopNav from "../TopNav";
import LifeReportShell from "./_shell"; // or { LifeReportShell } if that's how it's exported

export default function LifeReportPage() {
  return (
   <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(900px_500px_at_20%_0%,rgba(168,85,247,0.14),transparent_55%),linear-gradient(to_bottom,#050816,#070A12_40%,#000000)]">

      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <LifeReportShell />
      </main>
    </div>
  );
}
