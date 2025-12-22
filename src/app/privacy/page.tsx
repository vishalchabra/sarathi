import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/40">
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Sārathi</div>
              <div className="text-[11px] text-slate-400">
                The charioteer of your journey within
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
            <Link href="/about" className="hover:text-slate-50">
              About
            </Link>
            <Link href="/faqs" className="hover:text-slate-50">
              FAQs
            </Link>
            <Link href="/contact" className="hover:text-slate-50">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-slate-50">
              Privacy Policy
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-200/80">
              This is a simple privacy summary for the private beta. We’ll keep improving it as the product evolves.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 text-sm leading-7 text-slate-200/80">
            <section>
              <div className="font-semibold text-slate-100">What we collect</div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Birth details you enter (date, time, place) to personalize guidance.</li>
                <li>Questions you ask in the app, and responses generated for you.</li>
                <li>Basic usage data to improve reliability (non-sensitive, product-focused).</li>
              </ul>
            </section>

            <section>
              <div className="font-semibold text-slate-100">How we use it</div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>To compute your chart, dashas, transits, and timing windows.</li>
                <li>To personalize your guidance inside Life Report and Chat.</li>
                <li>To improve quality, safety, and stability of the app.</li>
              </ul>
            </section>

            <section>
              <div className="font-semibold text-slate-100">Storage</div>
              <p className="mt-2">
                In the current beta, some data may be stored locally in your browser (localStorage) for convenience.
                We aim to minimize what we store and avoid collecting anything unnecessary.
              </p>
            </section>

            <section>
              <div className="font-semibold text-slate-100">Sharing</div>
              <p className="mt-2">
                We do not sell your data. We do not share your personal details with third parties for marketing.
                Service providers may be used only to run the product (hosting, analytics, AI) and only as needed.
              </p>
            </section>

            <section>
              <div className="font-semibold text-slate-100">Your control</div>
              <p className="mt-2">
                You can clear your local saved data from within the app (where available) or by clearing your browser storage.
                If you want deletion help, contact us.
              </p>
            </section>

            <div className="pt-2 text-xs text-slate-300/70">
              Last updated: {new Date().toISOString().slice(0, 10)}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
