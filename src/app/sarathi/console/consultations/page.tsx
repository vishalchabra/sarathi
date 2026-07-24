import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import TopNav from "../../TopNav";

export default async function ConsoleConsultationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/login?next=/sarathi/console/consultations");
  }

  const entitlements = await getUserEntitlements(user.id);

 if (entitlements.role !== "admin") {
  redirect("/sarathi");
}

  const { data: bookings } = await supabase
    .from("consultation_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen astro-bg text-foreground">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
            Sārathi Console
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Consultation Requests
          </h1>

          <p className="mt-2 text-sm text-slate-700">
            View incoming one-on-one consultation booking requests.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white/80 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border)] bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Preferred Slot</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Focus</th>
              </tr>
            </thead>

            <tbody>
              {(bookings ?? []).map((booking: any) => (
                <tr
                  key={booking.id}
                  className="border-b border-[color:var(--border)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-slate-700">
                    {booking.created_at
                      ? new Date(booking.created_at).toLocaleString()
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {booking.customer_name || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {booking.customer_email || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {booking.customer_phone || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    <div>{booking.preferred_date || "—"}</div>
                    <div className="text-xs text-slate-500">
                      {booking.preferred_time || "—"} · {booking.timezone || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {booking.duration_minutes} min
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      {booking.status || "pending"}
                    </span>
                  </td>

                  <td className="max-w-xs px-4 py-3 text-slate-700">
                    {booking.question_or_focus || "—"}
                  </td>
                </tr>
              ))}

              {!bookings?.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No consultation requests yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}