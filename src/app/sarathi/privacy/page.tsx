// FILE: src/app/sarathi/privacy/page.tsx
import Link from "next/link";

const supportEmail = "support@sarathiyourguide.com";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/sarathi" className="text-sm text-slate-700 hover:text-slate-900">
            ← Back to Sārathi
          </Link>
          <Link
            href="/sarathi/login?next=/sarathi/life-report"
            className="rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
          >
            Get your Life Report
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold text-slate-700">
          Privacy Policy
        </div>

        <h1 className="mt-5 text-3xl font-semibold md:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="mt-8 space-y-6 rounded-2xl astro-card p-6 text-sm leading-7 text-slate-700">
          {children}
        </div>

        <footer className="mt-10 border-t border-[color:var(--border)] pt-6 text-xs text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-slate-900" href="/sarathi/about">About</Link>
            <Link className="hover:text-slate-900" href="/sarathi/terms">Terms</Link>
            <Link className="hover:text-slate-900" href="/sarathi/contact">Contact</Link>
          </div>
        </footer>
      </section>
    </main>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-6 text-base font-semibold text-slate-900">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 ml-5 list-disc space-y-2">{children}</ul>;
}

export default function PrivacyPage() {
  return (
    <Shell>
      <P>
        This Privacy Policy explains how Sārathi collects, uses, stores, and
        protects information when you access or use our website, applications,
        reports, chat features, and related services.
      </P>

      <P>
        By using Sārathi, you acknowledge that you have read and understood this
        Privacy Policy. If you do not agree with this Privacy Policy, you should
        not use the service.
      </P>

      <H>1. Information we collect</H>
      <P>We may collect the following categories of information:</P>
      <UL>
        <li>Account information, such as your name, email address, login details, and user profile.</li>
        <li>Birth information, such as date of birth, time of birth, place of birth, timezone, latitude, and longitude.</li>
        <li>Content you provide, including questions, chat messages, preferences, notes, and report inputs.</li>
        <li>Usage and technical data, including device information, browser type, IP address, pages visited, feature usage, logs, and diagnostic data.</li>
        <li>Payment-related information where applicable. Payment details may be processed by third-party payment providers and may not be stored directly by Sārathi.</li>
      </UL>

      <H>2. How we use information</H>
      <P>We may use information for the following purposes:</P>
      <UL>
        <li>To create and manage your account.</li>
        <li>To generate astrology reports, chart insights, responses, and related guidance.</li>
        <li>To provide, maintain, improve, secure, and personalize the service.</li>
        <li>To process subscriptions, payments, trials, and account access where applicable.</li>
        <li>To respond to support requests and communicate service-related updates.</li>
        <li>To monitor reliability, prevent misuse, detect abuse, and protect the service.</li>
        <li>To comply with applicable legal, regulatory, tax, accounting, or contractual obligations.</li>
      </UL>

      <H>3. Astrology and guidance disclaimer</H>
      <P>
        Sārathi provides astrology-based informational and reflective guidance.
        It is not a substitute for professional advice, including medical,
        legal, financial, psychological, investment, or other regulated advice.
        Users remain responsible for their own decisions and actions.
      </P>

      <H>4. How we share information</H>
      <P>
        We do not sell your personal information. We may share limited
        information with trusted service providers only where necessary to
        operate, secure, host, analyze, support, or process payments for the
        service.
      </P>

      <P>We may also disclose information if required to do so by law, regulation, court order, legal process, or to protect rights, safety, security, and integrity.</P>

      <H>5. Third-party services</H>
      <P>
        Sārathi may use third-party providers for hosting, authentication,
        database services, analytics, communications, payments, AI processing,
        and technical infrastructure. These providers may process information
        according to their own terms and privacy policies.
      </P>

      <H>6. Data storage and retention</H>
      <P>
        We retain information for as long as reasonably necessary to provide the
        service, maintain records, comply with legal obligations, resolve
        disputes, enforce agreements, and protect the service. Retention periods
        may vary depending on the type of information and the purpose for which
        it is used.
      </P>

      <H>7. Security</H>
      <P>
        We use reasonable administrative, technical, and organizational measures
        designed to protect information. However, no method of transmission,
        storage, or electronic processing is completely secure, and we cannot
        guarantee absolute security.
      </P>

      <H>8. Your choices and rights</H>
      <P>
        Depending on your location and applicable law, you may have rights to
        access, correct, delete, restrict, or object to certain processing of
        your personal information. You may contact us to request assistance.
      </P>

      <P>
        To request access, correction, or deletion, contact{" "}
        <span className="font-medium text-slate-900">{supportEmail}</span>.
      </P>

      <H>9. International use</H>
      <P>
        Sārathi may be accessed globally. Your information may be processed in
        countries other than your country of residence. By using the service, you
        acknowledge that information may be transferred, stored, and processed
        internationally where permitted by applicable law.
      </P>

      <H>10. Children</H>
      <P>
        Sārathi is not intended for use by children without appropriate parental
        or guardian consent. If we become aware that information has been
        collected from a child in a manner not permitted by applicable law, we may
        take steps to delete it.
      </P>

      <H>11. Changes to this Privacy Policy</H>
      <P>
        We may update this Privacy Policy from time to time. The updated version
        will be posted on this page with a revised “Last updated” date. Continued
        use of the service after changes are posted means you accept the updated
        Privacy Policy.
      </P>

      <H>12. Contact</H>
      <P>
        For privacy-related questions, contact{" "}
        <span className="font-medium text-slate-900">{supportEmail}</span>.
      </P>
    </Shell>
  );
}