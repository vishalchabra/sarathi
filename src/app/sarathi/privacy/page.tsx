// FILE: src/app/sarathi/privacy/page.tsx
import Link from "next/link";

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[color:var(--primary)]/20 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] astro-bg/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="text-sm text-slate-900/80 hover:text-slate-900">
            ← Back to Sārathi
          </Link>
          <Link
            href="/sarathi/life-report"
            className="rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90"
          >
            Get your Life Report
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="mt-8 space-y-5 rounded-2xl astro-card p-6 text-sm leading-relaxed text-slate-900/75 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
          {children}
        </div>

        <footer className="mt-10 border-t border-[color:var(--border)] pt-6 text-xs text-slate-900/55">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-slate-900" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/terms">
              Terms
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/contact">
              Contact
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-sm font-semibold text-slate-900/90">{children}</div>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 ml-5 list-disc space-y-2">{children}</ul>;
}

export default function PrivacyPage() {
  // Change this later if you have a real support email/domain.
  const supportEmail = "support@sarathiyourguide.com";

  return (
    <Shell title="Privacy Policy">
      <P>
        Sārathi is built for clarity and trust. This policy explains what we collect
        and why.
      </P>

      <H>What we collect</H>
      <UL>
        <li>Birth details you enter (date/time/place) to generate your report.</li>
        <li>Questions you ask in chat (to respond and improve quality).</li>
        <li>Basic usage analytics (to understand feature usage and stability).</li>
      </UL>

      <H>What we do NOT do</H>
      <UL>
        <li>We do not sell your personal data.</li>
        <li>We do not run ads based on your birth details.</li>
        <li>We do not publish your data or make it searchable.</li>
      </UL>

      <H>How data is used</H>
      <P>
        We use your inputs only to generate your reports and guidance, improve reliability,
        and protect the service from abuse.
      </P>

      <H>Data storage</H>
      <P>
        Depending on your setup, some data may be stored locally in your browser (for convenience)
        and/or securely on servers (to sync across devices). We keep this minimal and purposeful.
      </P>

      <H>Your control</H>
      <P>
        You can request deletion of stored data by contacting{" "}
        <span className="text-slate-900/90">{supportEmail}</span>.
      </P>

      <H>Security</H>
      <P>
        We use standard security practices, but no system is perfect. Please avoid sharing
        highly sensitive personal information in free-text chat.
      </P>

      <H>Updates</H>
      <P>
        If we change this policy, we will update the “Last updated” date at the top of this page.
      </P>
    </Shell>
  );
}
