// FILE: src/app/sarathi/terms/page.tsx
import Link from "next/link";

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
          Terms of Use
        </div>

        <h1 className="mt-5 text-3xl font-semibold md:text-4xl">
          Terms of Use
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="mt-8 space-y-6 rounded-2xl astro-card p-6 text-sm leading-7 text-slate-700">
          {children}
        </div>

        <footer className="mt-10 border-t border-[color:var(--border)] pt-6 text-xs text-slate-600">
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-slate-900" href="/sarathi/about">
              About
            </Link>
            <Link className="hover:text-slate-900" href="/sarathi/privacy">
              Privacy
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
  return (
    <h2 className="mt-6 text-base font-semibold text-slate-900">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 ml-5 list-disc space-y-2">{children}</ul>;
}

export default function TermsPage() {
  return (
    <Shell>
      <P>
        These Terms of Use (“Terms”) govern your access to and use of the
        Sārathi website, applications, reports, chat features, astrology tools,
        and related services (collectively, the “Service”).
      </P>

      <P>
        By accessing or using Sārathi, you agree to be bound by these Terms. If
        you do not agree to these Terms, you should not use the Service.
      </P>

      <H>1. Eligibility and account responsibility</H>

      <P>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account.
      </P>

      <P>
        You agree to provide accurate information and to keep your account
        information reasonably up to date.
      </P>

      <H>2. Nature of the service</H>

      <P>
        Sārathi provides astrology-based informational, educational, reflective,
        and guidance-oriented content. The Service is not intended to replace
        medical, legal, financial, investment, psychological, or other
        professional advice.
      </P>

      <P>
        Any decisions or actions taken based on information provided through the
        Service are solely your responsibility.
      </P>

      <H>3. No guarantees or warranties</H>

      <P>
        Astrology involves interpretation, symbolic systems, timing models, and
        probabilistic guidance. Sārathi does not guarantee outcomes, events,
        timelines, or results.
      </P>

      <P>
        The Service is provided on an “as is” and “as available” basis without
        warranties of any kind, whether express or implied, to the fullest
        extent permitted by applicable law.
      </P>

      <H>4. Acceptable use</H>

      <P>You agree not to:</P>

      <UL>
        <li>Use the Service for unlawful, harmful, fraudulent, abusive, or misleading purposes.</li>
        <li>Attempt to interfere with, disrupt, scrape, reverse engineer, or compromise the Service or infrastructure.</li>
        <li>Use automated systems or unauthorized methods to access the platform.</li>
        <li>Upload malicious code, harmful content, or material that violates applicable law.</li>
        <li>Impersonate another person or misrepresent your identity.</li>
      </UL>

      <H>5. Payments, subscriptions, and pricing</H>

      <P>
        Certain features may require payment, subscription access, or usage
        limits. Pricing, plans, trial access, feature availability, and
        subscription structures may change at any time.
      </P>

      <P>
        Unless otherwise required by law, payments are non-refundable once
        services or digital content have been delivered or accessed.
      </P>

      <H>6. Service availability and modifications</H>

      <P>
        We may modify, suspend, restrict, discontinue, or update any aspect of
        the Service at any time without liability.
      </P>

      <P>
        We do not guarantee uninterrupted availability, accuracy, completeness,
        or error-free operation of the Service.
      </P>

      <H>7. Intellectual property</H>

      <P>
        The Sārathi platform, brand, design, software, reports, systems,
        interfaces, text, graphics, and related content are protected by
        applicable intellectual property and proprietary rights laws.
      </P>

      <P>
        You may not reproduce, redistribute, resell, copy, modify, or exploit
        the Service or its content except as permitted by applicable law or with
        written authorization.
      </P>

      <H>8. Limitation of liability</H>

      <P>
        To the fullest extent permitted by law, Sārathi and its operators,
        affiliates, licensors, partners, and service providers shall not be
        liable for indirect, incidental, consequential, special, exemplary, or
        punitive damages arising from or related to use of the Service.
      </P>

      <P>
        This includes, without limitation, loss of profits, business,
        opportunity, goodwill, data, or personal outcomes related to decisions
        made using the Service.
      </P>

      <H>9. Indemnification</H>

      <P>
        You agree to indemnify and hold harmless Sārathi, its operators,
        affiliates, partners, and service providers from claims, liabilities,
        damages, losses, costs, and expenses arising from your misuse of the
        Service or violation of these Terms.
      </P>

      <H>10. Privacy</H>

      <P>
        Your use of the Service is also governed by the Privacy Policy, which
        forms part of these Terms.
      </P>

      <H>11. Termination or restriction</H>

      <P>
        We reserve the right to suspend, restrict, or terminate access to the
        Service at our discretion where necessary to protect the platform,
        comply with law, investigate abuse, enforce these Terms, or maintain
        operational integrity.
      </P>

      <H>12. Governing law</H>

      <P>
        These Terms shall be governed by and interpreted in accordance with
        applicable laws and regulations governing the operation of the Service,
        without regard to conflict of law principles.
      </P>

      <H>13. Changes to these Terms</H>

      <P>
        We may revise these Terms from time to time. Updated versions will be
        posted on this page with a revised “Last updated” date.
      </P>

      <P>
        Continued use of the Service after updated Terms are posted constitutes
        acceptance of the revised Terms.
      </P>

      <H>14. Contact</H>

      <P>
        For questions regarding these Terms, please contact Sārathi through the
        official contact channels listed on the platform.
      </P>
    </Shell>
  );
}