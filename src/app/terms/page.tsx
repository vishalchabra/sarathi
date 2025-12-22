import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function TermsPage() {
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
              Terms of Use
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-200/80">
              Simple terms for private beta use. We’ll refine this as Sārathi expands.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 text-sm leading-7 text-slate-200/80">
            <section>
              <div className="font-semibold text-slate-100">Decision support, not certainty</div>
              <p className="mt-2">
                Sārathi provides guidance for reflection and planning. It is not a substitute for professional advice
                (medical, legal, financial, or otherwise). You are responsible for your decisions.
              </p>
            </section>

            <section>
              <div className="font-semibold text-slate-100">No guarantees</div>
              <p className="mt-2">
                Astrology is probabilistic. We do not guarantee outcomes. We aim for clarity and usefulness, not prediction certainty.
              </p>
            </section>

            <section>
              <div className="font-semibold text-slate-100">Acceptable use</div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Do not attempt to abuse, reverse-engineer, or disrupt the service.</li>
                <li>Do not use Sārathi to harass others or produce harmful content.</li>
                <li>Respect privacy: do not upload or share sensitive data you do not own.</li>
              </ul>
            </section>

            <section>
              <div className="font-semibold text-slate-100">Beta limitations</div>
              <p className="mt-2">
                The beta may change, break, or reset. Features may be added/removed. We may update these terms.
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
