import Link from "next/link";

function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen astro-bg text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/sarathi"
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            ← Back to Sārathi
          </Link>

          <Link
            href="/sarathi/individual/login?next=/sarathi/life-report"
            className="rounded-full bg-[#6E4BC6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3FB0]"
          >
            Get your Life Report
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-14 pt-10">
        <div className="inline-flex rounded-full astro-card px-4 py-1 text-xs font-semibold text-slate-700">
          Refund Policy
        </div>

        <h1 className="mt-5 text-3xl font-semibold md:text-4xl">
          Refund Policy
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Last updated: 18 July 2026
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
            <Link className="hover:text-slate-900" href="/sarathi/terms">
              Terms
            </Link>
            <Link className="hover:text-slate-900" href="/refund-policy">
              Refund Policy
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

export default function RefundPolicyPage() {
  return (
    <Shell>
      <P>
        This Refund Policy explains when refunds may or may not be available
        for purchases made through Sārathi.
      </P>

      <P>
        By purchasing any paid product, digital service, question pack, or
        subscription, you agree to this Refund Policy.
      </P>

      <H>1. Nature of our services</H>

      <P>
        Sārathi provides digital astrology products and services, including
        Life Reports, Ask Sārathi question packs, Astrologer Data Engine
        subscriptions, premium astrology tools, and other digital services that
        may be introduced in the future.
      </P>

      <P>
        Since these products and services are delivered electronically, refunds
        are limited once access has been provided or digital content has been
        generated.
      </P>

      <H>2. Life Reports</H>

      <P>
        Life Reports are personalised digital reports generated using the birth
        details provided by the user.
      </P>

      <P>
        Once a report has been generated or accessed, the purchase is generally
        non-refundable.
      </P>

      <P>
        If payment succeeds but the report is not generated, cannot be accessed
        because of a technical issue, or a duplicate payment is identified, we
        will investigate and may regenerate the report, restore access, or
        issue a refund where the issue cannot reasonably be resolved.
      </P>

      <P>
        If the same Life Report is accidentally purchased more than once for
        the same profile, we may refund the duplicate purchase or convert the
        amount into account credit, at our discretion.
      </P>

      <H>3. Ask Sārathi question packs</H>

      <P>
        Ask Sārathi question packs provide prepaid credits that may be used to
        ask chart-based questions.
      </P>

      <P>
        Refunds are generally not available for used credits, partially used
        packs, or answers that do not match a user&apos;s personal expectations
        or interpretation.
      </P>

      <P>
        If a technical issue prevents a response from being generated, the
        affected question credit may be restored or another appropriate
        solution may be provided.
      </P>

      <H>4. Astrologer Data Engine Subscriptions</H>

      <P>
        Data Engine subscriptions renew automatically unless cancelled before
        the next billing date.
      </P>

      <P>
        You may cancel your subscription at any time. Cancellation stops future
        renewals, and access will continue until the end of the current paid
        billing period.
      </P>

      <P>
        Partial or prorated refunds are generally not provided for unused time
        remaining in an active subscription period.
      </P>

      <H>5. Promotional purchases</H>

      <P>
        Purchases made using promo codes, referral discounts, introductory
        pricing, launch offers, or other campaigns remain subject to this Refund
        Policy unless expressly stated otherwise.
      </P>

      <H>6. Duplicate payments</H>

      <P>
        If you are charged more than once for the same purchase due to a
        technical or payment-processing issue, the duplicate payment will be
        reviewed and refunded after verification.
      </P>

      <H>7. Failed transactions or missing access</H>

      <P>
        If payment is successfully completed but the purchased product or
        service is not made available, we will first attempt to restore access
        or complete delivery.
      </P>

      <P>
        If the issue cannot be resolved within a reasonable period, an
        appropriate refund may be issued.
      </P>

      <H>8. Exceptional circumstances</H>

      <P>
        Although digital purchases are generally non-refundable, genuine
        exceptional cases may be reviewed individually.
      </P>

      <P>
        Any refund approved outside the circumstances expressly covered by this
        policy remains at Sārathi&apos;s discretion.
      </P>

      <H>9. Contact</H>

      <P>
        For payment, billing, refund requests, or access-related issues, please
        contact us before initiating a payment dispute.
      </P>

      <P>Please include:</P>

      <UL>
        <li>Your registered email address</li>
        <li>The purchase date</li>
        <li>The transaction ID, if available</li>
        <li>A brief description of the issue</li>
      </UL>

      <P>
        Email:{" "}
        <a
          href="mailto:support@sarathiyourguide.com"
          className="font-semibold text-[#6E4BC6] hover:underline"
        >
          support@sarathiyourguide.com
        </a>
      </P>

      <H>10. Changes to this policy</H>

      <P>
        We may update this Refund Policy from time to time to reflect changes
        in our products, payment processes, business operations, or applicable
        legal requirements.
      </P>

      <P>
        The latest version will remain available on the Sārathi website.
      </P>
    </Shell>
  );
}