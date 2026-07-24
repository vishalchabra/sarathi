import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import ConsoleLayout from "@/components/console/ConsoleLayout";

export default async function SarathiConsolePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/login?next=/sarathi/console");
  }

  const entitlements = await getUserEntitlements(user.id);

  if (entitlements.role !== "admin") {
    redirect("/sarathi");
  }

  const { count: consultationCount } = await supabase
    .from("consultation_bookings")
    .select("*", { count: "exact", head: true });

  const { count: questionCount } = await supabase
    .from("question_usage")
    .select("*", { count: "exact", head: true });

  const { count: purchaseCount } = await supabase
    .from("purchases")
    .select("*", { count: "exact", head: true });

  const { count: subscriptionCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true });

  const cards = [
    {
      title: "Consultation Requests",
      value: consultationCount ?? 0,
      href: "/sarathi/console/consultations",
    },
    {
      title: "Ask Sārathi Questions",
      value: questionCount ?? 0,
      href: "/sarathi/console/questions",
    },
    {
      title: "Purchases",
      value: purchaseCount ?? 0,
      href: "/sarathi/console/payments",
    },
    {
      title: "Subscriptions",
      value: subscriptionCount ?? 0,
      href: "/sarathi/console/payments",
    },
  ];

  return (
    <ConsoleLayout
      title="Operations Dashboard"
      description="Manage bookings, payments, promo codes and business activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-medium text-slate-600">
              {card.title}
            </div>

            <div className="mt-3 text-3xl font-semibold text-slate-900">
              {card.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/sarathi/console/consultations"
          className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm"
        >
          <div className="font-semibold text-slate-900">Consultations</div>
          <p className="mt-2 text-sm text-slate-700">
            View and manage consultation booking requests.
          </p>
        </Link>

        <Link
          href="/sarathi/console/products"
          className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm"
        >
          <div className="font-semibold text-slate-900">Products</div>
          <p className="mt-2 text-sm text-slate-700">
            Manage prices, descriptions and product availability.
          </p>
        </Link>

        <Link
          href="/sarathi/console/promo-codes"
          className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm"
        >
          <div className="font-semibold text-slate-900">Promo Codes</div>
          <p className="mt-2 text-sm text-slate-700">
            Create and manage promotional discounts.
          </p>
        </Link>

        <Link
          href="/sarathi/console/payments"
          className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm"
        >
          <div className="font-semibold text-slate-900">Payments</div>
          <p className="mt-2 text-sm text-slate-700">
            View purchases, subscriptions and refunds.
          </p>
        </Link>
      </div>
    </ConsoleLayout>
  );
}