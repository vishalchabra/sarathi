// FILE: src/app/sarathi/terms/page.tsx
import Link from "next/link";

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
          <Link
            href="/sarathi/life-report"
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Get your Life Report
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-white/60">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/75 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          {children}
        </div>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-white" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-white" href="/sarathi/privacy">
              Privacy
            </Link>
            <Link className="hover:text-white" href="/sarathi/contact">
              Contact
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-sm font-semibold text-white/90">{children}</div>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 ml-5 list-disc space-y-2">{children}</ul>;
}

export default function TermsPage() {
  return (
    <Shell title="Terms of Use">
      <P>
        By using Sārathi, you agree to these terms.
      </P>

      <H>1) Guidance, not guarantees</H>
      <P>
        Sārathi provides informational guidance based on traditional Vedic astrology models.
        It is not professional advice (medical, legal, financial, or mental health).
        Use your judgment and consult qualified professionals when needed.
      </P>

      <H>2) A calm, non-fatalist approach</H>
      <P>
        We aim to offer steady, non-fearful guidance. You remain responsible for your decisions
        and actions.
      </P>

      <H>3) Acceptable use</H>
      <UL>
        <li>Do not harass, threaten, or exploit others.</li>
        <li>Do not request illegal activity or misuse the service.</li>
        <li>Do not attempt to disrupt, scrape, or reverse engineer the system.</li>
      </UL>

      <H>4) Service changes</H>
      <P>
        Features may change, be improved, or be discontinued. Limits, pricing, and availability
        may evolve over time.
      </P>

      <H>5) Accounts & access</H>
      <P>
        We may restrict access if we detect abuse, fraud, or violations of these terms.
      </P>

      <H>6) Liability</H>
      <P>
        Sārathi is provided “as is” without warranties. We are not liable for decisions you make
        based on guidance from the service.
      </P>
    </Shell>
  );
}
