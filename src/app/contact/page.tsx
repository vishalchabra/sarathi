import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail } from "lucide-react";

export default function ContactPage() {
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
            <Link href="/privacy" className="hover:text-slate-50">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-50">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-slate-50">
              Contact
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-200/80">
              For beta access, feedback, or data deletion requests, reach out below.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-sm leading-7 text-slate-200/80">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
              <div className="flex items-center gap-2 text-slate-100 font-semibold">
                <Mail className="h-4 w-4 text-indigo-300" />
                Email
              </div>
              <p className="mt-2">
                Replace this with your official support email:
                <span className="ml-2 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-100">
                  support@sarathi.app
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-300/70">
                Tip: once you have a real email, update this line only.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              <Link href="/" className="hover:text-slate-200">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
