// FILE: src/app/sarathi/contact/page.tsx
import Link from "next/link";

export default function ContactPage() {
  // Change this later to your real email/domain.
  const supportEmail = "support@sarathiyourguide.com";

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A14]/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="text-sm text-white/80 hover:text-white">
            ← Back to Sārathi
          </Link>
          <div className="flex items-center gap-4">
            <Link className="text-sm text-white/70 hover:text-white" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="text-sm text-white/70 hover:text-white" href="/sarathi/terms">
              Terms
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          Support · Feedback · Data requests
        </div>

        <h1 className="mt-5 text-3xl font-semibold">Contact</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          Have feedback, found an issue, or want to request data deletion? We’d love to hear from you.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/75 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          <div className="text-sm font-semibold text-white/90">Email</div>
          <p className="mt-2">
            <span className="text-white/90">{supportEmail}</span>
          </p>

          <div className="mt-6 text-sm font-semibold text-white/90">What to include</div>
          <ul className="mt-2 ml-5 list-disc space-y-2">
            <li>What you were trying to do</li>
            <li>What happened instead</li>
            <li>A screenshot (if possible)</li>
            <li>Your browser/device (optional)</li>
          </ul>

          <div className="mt-6">
            <Link
              href="/sarathi/chat"
              className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Ask in chat instead →
            </Link>
          </div>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/55">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-white" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-white" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="hover:text-white" href="/sarathi/terms">
              Terms
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
