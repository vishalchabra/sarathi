"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import tzLookup from "tz-lookup";
import {
  addClientChart,
  createAstrologerClient,
  listAstrologerClients,
  updateAstrologerClient,
  type AstrologerClient,
} from "@/lib/supabase/astrologer-crm-service";
import { useRouter } from "next/navigation";
type ClientStatus = "active" | "follow_up" | "closed";
type CrmTab = "dashboard" | "add";
type PlaceLite = { name: string; lat: number; lon: number };

const cityCache = new Map<string, PlaceLite[]>();

function StatusChip({ status }: { status?: string | null }) {
  const label =
    status === "follow_up" ? "Follow-up" :
    status === "closed" ? "Closed" :
    status === "vip" ? "VIP" : "Active";

  const cls =
    status === "follow_up" ? "border-amber-200 bg-amber-50 text-amber-700" :
    status === "closed" ? "border-slate-200 bg-slate-50 text-slate-600" :
    status === "vip" ? "border-violet-200 bg-violet-50 text-violet-700" :
    "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <span className={["inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", cls].join(" ")}>
      {label}
    </span>
  );
}

function StatCard({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{note}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-4 py-2 text-sm font-semibold transition",
        active
          ? "border border-[color:var(--border)] bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LockingCityAutocomplete({
  value,
  onSelect,
  placeholder = "Start typing a city",
}: {
  value: PlaceLite | null;
  onSelect: (p: PlaceLite | null) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PlaceLite[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setQ(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const query = q.trim();

    if (query.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }

    if (cityCache.has(query)) {
      setItems(cityCache.get(query)!);
      setOpen(true);
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      setLoading(true);

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;

        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
          referrerPolicy: "no-referrer",
        });

        const json = (await res.json()) as any[];

        const out = json.map((r) => {
          const city =
            r.address?.city ||
            r.address?.town ||
            r.address?.village ||
            r.address?.municipality ||
            r.address?.hamlet ||
            r.address?.county ||
            r.address?.region;

          const state =
            r.address?.state ||
            r.address?.state_district ||
            r.address?.province ||
            r.address?.region ||
            "";

          const country = r.address?.country || "";

          return {
            name:
              [city, state, country]
                .filter(Boolean)
                .filter((value, index, arr) => arr.indexOf(value) === index)
                .join(", ") || r.display_name,
            lat: Number(r.lat),
            lon: Number(r.lon),
          };
        });

        cityCache.set(query, out);
        setItems(out);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q]);

  function commit(place: PlaceLite) {
    setQ(place.name);
    setItems([]);
    setOpen(false);
    onSelect(place);
    inputRef.current?.blur();
  }

  function clearAll() {
    setQ("");
    setItems([]);
    setOpen(false);
    onSelect(null);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        placeholder={placeholder}
        autoComplete="off"
        value={q}
        className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[color:var(--primary)]"
        onFocus={() => {
          if (items.length) setOpen(true);
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if (next && next.closest("[data-citymenu]")) return;
          setOpen(false);
        }}
        onChange={(e) => {
          const nextValue = e.target.value;
          setQ(nextValue);

          if (value && nextValue !== value.name) {
            onSelect(null);
          }
        }}
      />

      {q ? (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearAll}
          aria-label="Clear"
          title="Clear"
        >
          x
        </button>
      ) : null}

      {open ? (
        <div data-citymenu className="absolute z-20 mt-1 w-full rounded-md border border-[color:var(--border)] bg-white text-slate-800 shadow-xl">
          {loading ? <div className="px-3 py-2 text-sm text-slate-500">Searching...</div> : null}

          {!loading && !items.length ? (
            <div className="px-3 py-2 text-sm text-slate-500">No results</div>
          ) : null}

          {!loading
            ? items.map((place, index) => (
                <button
                  key={`${place.name}-${index}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => commit(place)}
                >
                  {place.name}
                  <span className="ml-2 text-xs text-slate-400">
                    {place.lat.toFixed(2)}, {place.lon.toFixed(2)}
                  </span>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<CrmTab>("dashboard");
  const [clients, setClients] = useState<AstrologerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ClientStatus | "vip">("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [primaryIssue, setPrimaryIssue] = useState("");
  const [clientStatus, setClientStatus] = useState<ClientStatus>("active");
  const [nextAction, setNextAction] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remediesSuggested, setRemediesSuggested] = useState("");
  const [notes, setNotes] = useState("");

  const [birthDateISO, setBirthDateISO] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState<PlaceLite | null>(null);
  const [birthTimezone, setBirthTimezone] = useState("Asia/Kolkata");
  const [generatedChart, setGeneratedChart] = useState<any | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!birthPlace) return;

    try {
      const tz = tzLookup(birthPlace.lat, birthPlace.lon);
      setBirthTimezone(tz);
    } catch {}
  }, [birthPlace]);

  async function loadClients() {
    try {
      setLoading(true);
      setError("");
      const rows = await listAstrologerClients();
      setClients(rows);
    } catch (e: any) {
      setError(e?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const dashboard = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(
      (client) => (client.client_status ?? "active") === "active"
    ).length;
    const followUps = clients.filter(
      (client) => client.client_status === "follow_up"
    ).length;
    const vip = clients.filter((client) => client.is_vip === true).length;
    const closed = clients.filter(
      (client) => client.client_status === "closed"
    ).length;
    const remedies = clients.filter((client) =>
      Boolean(client.remedies_suggested)
    ).length;
    const upcomingDates = clients.filter((client) => {
      if (!client.next_follow_up_date) return false;
      return client.next_follow_up_date >= todayISO();
    }).length;
    const today = new Date().toISOString().slice(0, 10);
const dailyTasks = clients
  .filter((client) => {
    const isDueFollowUp =
      client.client_status === "follow_up" &&
      client.next_follow_up_date &&
      client.next_follow_up_date <= today;

    const isVipActive =
      client.is_vip === true &&
      (client.client_status ?? "active") !== "closed";

    return isDueFollowUp || isVipActive;
  })
  .sort((a, b) => {
    const aDue =
      a.client_status === "follow_up" &&
      a.next_follow_up_date &&
      a.next_follow_up_date <= today;

    const bDue =
      b.client_status === "follow_up" &&
      b.next_follow_up_date &&
      b.next_follow_up_date <= today;

    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    if (a.is_vip && !b.is_vip) return -1;
    if (!a.is_vip && b.is_vip) return 1;

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  })
  .slice(0, 5);
const dueFollowUps = clients.filter(
  (client) =>
    client.client_status === "follow_up" &&
    client.next_follow_up_date &&
    client.next_follow_up_date <= today
).length;
    return {
  total,
  active,
  followUps,
  vip,
  closed,
  remedies,
  upcomingDates,
  dueFollowUps,
  dailyTasks,
};
  }, [clients]);

 const filteredClients = useMemo(() => {
  const query = q.trim().toLowerCase();

  const result = clients.filter((client) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "vip"
        ? client.is_vip === true
        : (client.client_status ?? "active") === statusFilter;

    const matchesQuery = !query
      ? true
      : [
          client.name,
          client.phone,
          client.email,
          client.notes,
          client.primary_issue,
          client.consultation_type,
          client.remedies_suggested,
          client.next_action,
          client.next_follow_up_date,
          client.client_status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

    return matchesStatus && matchesQuery;
  });

  return result.sort((a, b) => {
    if (a.is_vip && !b.is_vip) return -1;
    if (!a.is_vip && b.is_vip) return 1;

    return (
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
    );
  });
}, [clients, q, statusFilter]);
async function handleMarkDone(clientId: string) {
  try {
    setError("");

    await updateAstrologerClient({
      clientId,
      clientStatus: "active",
      nextFollowUpDate: "",
      nextAction: "",
    });

    await loadClients();
  } catch (e: any) {
    setError(e?.message || "Failed to mark follow-up as done.");
  }
}
  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setConsultationType("");
    setPrimaryIssue("");
    setClientStatus("active");
    setNextAction("");
    setNextFollowUpDate("");
    setRemediesSuggested("");
    setNotes("");
    setBirthDateISO("");
    setBirthTime("");
    setBirthPlace(null);
    setBirthTimezone("Asia/Kolkata");
    setGeneratedChart(null);
  }

  async function handleGenerateClientChart() {
    if (!name.trim()) {
      setError("Please enter client name.");
      return;
    }

    if (!birthPlace) {
      setError("Please select birth city.");
      return;
    }

    if (!birthDateISO.trim() || !birthTime.trim()) {
      setError("Please enter birth date and time.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const selectedDateISO = todayISO();

      const res = await fetch("/api/data-engine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birth: {
            name: name.trim(),
            city: birthPlace.name,
            dateISO: birthDateISO.trim(),
            time: birthTime.trim(),
            timezone: birthTimezone,
            lat: birthPlace.lat,
            lon: birthPlace.lon,
          },
          plan: "pro",
          selectedDateISO,
          compareDateISO: null,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate chart.");
      }

      setGeneratedChart(json);
      setSuccess("Chart generated. You can now save this client and chart.");
    } catch (e: any) {
      setError(e?.message || "Failed to generate chart.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCreateClientWithChart() {
    if (!name.trim()) {
      setError("Please enter client name.");
      return;
    }

    if (!birthPlace) {
      setError("Please select birth city.");
      return;
    }

    if (!birthDateISO.trim() || !birthTime.trim()) {
      setError("Please enter birth date and time.");
      return;
    }

    if (clientStatus === "follow_up" && !nextFollowUpDate.trim()) {
      setError("Please select next follow-up date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const client = await createAstrologerClient({
        name,
        phone,
        email,
        notes,
        primaryIssue,
        consultationType,
        remediesSuggested,
        clientStatus,
        nextAction,
        nextFollowUpDate: clientStatus === "follow_up" ? nextFollowUpDate : "",
      });

      await addClientChart({
  clientId: client.id,
  chartName: `${name.trim()} Birth Chart`,
  birthDateISO: birthDateISO.trim(),
  birthTime: birthTime.trim(),
  birthTz: birthTimezone,
  lat: birthPlace.lat,
  lon: birthPlace.lon,
  placeName: birthPlace.name,
});

router.push(`/sarathi/data-engine/clients/${client.id}`);
return;
    } catch (e: any) {
      setError(e?.message || "Failed to save client and chart.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen astro-bg text-slate-800">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                  Premier CRM Workspace
                </div>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  Sarathi Premier CRM
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  Add client, generate chart, save birth details, issues,
                  remedies, follow-ups, and cases from one premium workspace.
                </p>
              </div>

              <Link
                href="/sarathi/data-engine"
                className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Back to Data Engine
              </Link>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 rounded-3xl border border-[color:var(--border)] bg-white/80 p-3 shadow-sm">
            <TabButton
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </TabButton>
            <TabButton active={activeTab === "add"} onClick={() => setActiveTab("add")}>
              Add Client + Chart
            </TabButton>
          </div>

          {activeTab === "dashboard" ? (
            <div className="space-y-6">
              {dashboard.dailyTasks.length ? (
  <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-base font-semibold text-amber-900">
          Today&apos;s Tasks
        </h2>
        <p className="mt-1 text-sm text-amber-800">
          Priority follow-ups and VIP clients that need attention.
        </p>
      </div>
    </div>

    <div className="mt-4 space-y-3">
      {dashboard.dailyTasks.map((client) => {
        const today = new Date().toISOString().slice(0, 10);
        const isDueFollowUp =
          client.client_status === "follow_up" &&
          client.next_follow_up_date &&
          client.next_follow_up_date <= today;

        return (
          <Link
            key={client.id}
            href={`/sarathi/data-engine/clients/${client.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-white/80 p-4 transition hover:bg-white md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {client.name}
                </span>

                {client.is_vip ? (
                  <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    VIP
                  </span>
                ) : null}

                {isDueFollowUp ? (
                  <span className="rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    Follow-up due
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-slate-600">
                {isDueFollowUp
                  ? `Follow-up date: ${client.next_follow_up_date}`
                  : client.next_action || "VIP client needs priority review"}
              </p>
            </div>

            <div className="flex items-center gap-3">
  {isDueFollowUp ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMarkDone(client.id);
      }}
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
    >
      Mark Done
    </button>
  ) : null}

  <span className="text-sm font-semibold text-amber-800">
    Open case →
  </span>
</div>
          </Link>
        );
      })}
    </div>
  </section>
) : null}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                <StatCard label="Total Clients" value={dashboard.total} note="Saved in Premier CRM" />
                <StatCard label="Active" value={dashboard.active} note="Open client cases" />
                <StatCard label="Follow-up" value={dashboard.followUps} note="Marked for follow-up" />
                <StatCard label="VIP Clients" value={dashboard.vip} note="Priority clients" />
                <StatCard label="Closed" value={dashboard.closed} note="Completed cases" />
                <StatCard label="Remedies" value={dashboard.remedies} note="Remedies logged" />
              </div>

              {dashboard.upcomingDates ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 shadow-sm">
                  {dashboard.upcomingDates} follow-up date
                  {dashboard.upcomingDates === 1 ? "" : "s"} coming up.
                </div>
              ) : null}
{dashboard.dueFollowUps > 0 ? (
  <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-base font-semibold text-red-800">
          Follow-up Reminders
        </h2>
        <p className="mt-1 text-sm text-red-700">
          {dashboard.dueFollowUps} client
          {dashboard.dueFollowUps === 1 ? "" : "s"} need follow-up today.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setStatusFilter("follow_up")}
        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"
      >
        View Follow-ups
      </button>
    </div>
  </section>
) : (
  <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
    <h2 className="text-base font-semibold text-emerald-800">
      No follow-ups due today
    </h2>
    <p className="mt-1 text-sm text-emerald-700">
      Your client follow-up list is clear for today.
    </p>
  </section>
)}
              <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Client Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {clients.length} saved client{clients.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    >
                      
                      <option value="all">All statuses</option>
                      <option value="active">Active</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="vip">VIP</option>
                      <option value="closed">Closed</option>
                    </select>

                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)] md:w-80"
                      placeholder="Search clients, issues, remedies..."
                    />
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
                  {loading ? (
                    <div className="p-6 text-sm text-slate-500">Loading clients...</div>
                  ) : null}

                  {!loading && !filteredClients.length ? (
                    <div className="p-8 text-center">
                      <div className="text-base font-semibold text-slate-900">
                        No clients found
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Add your first client and generate the chart from the
                        Add Client + Chart tab.
                      </p>
                    </div>
                  ) : null}

                  {!loading && filteredClients.length ? (
                    <div className="divide-y divide-[color:var(--border)]">
                      {filteredClients.map((client) => {
  const today = new Date().toISOString().slice(0, 10);
  const isFollowUpDue =
    client.client_status === "follow_up" &&
    client.next_follow_up_date &&
    client.next_follow_up_date <= today;

  return (
    <Link
      key={client.id}
      href={`/sarathi/data-engine/clients/${client.id}`}
      className={[
        "block p-5 transition hover:bg-slate-50",
        isFollowUpDue
          ? "border-l-4 border-red-400 bg-red-50/60"
          : client.is_vip
          ? "border-l-4 border-amber-400 bg-amber-50/40"
          : "",
      ].join(" ")}
    >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-base font-semibold text-slate-900">
                                  {client.name}
                                  {client.is_vip ? (
  <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
    VIP
  </span>
) : null}
                                </div>
                                <StatusChip status={client.client_status} />
                                {client.consultation_type ? (
                                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                                    {client.consultation_type}
                                  </span>
                                ) : null}
                                {client.next_follow_up_date ? (
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    Follow-up: {client.next_follow_up_date}
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-1 text-sm text-slate-500">
                                {[client.phone, client.email]
                                  .filter(Boolean)
                                  .join(" • ") || "No contact details"}
                              </div>
                            </div>

                            <div className="text-xs text-slate-400">
                              Updated{" "}
                              {new Date(client.updated_at).toLocaleDateString("en-GB")}
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Primary Issue
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                                {client.primary_issue || "—"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Remedies
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                                {client.remedies_suggested || "—"}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50/70 p-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Next Action
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                                {client.next_action || "—"}
                              </p>
                            </div>
                          </div>

                          {client.notes ? (
                            <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                              {client.notes}
                            </p>
                          ) : null}
                        </Link>
                         );
                      })}
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === "add" ? (
            <section className="space-y-6">
              <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Add Premier Client + Generate Chart
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter client details and birth details, generate the chart,
                      then save the client and chart together.
                    </p>
                  </div>

                  {generatedChart ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Chart generated
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      Chart not generated
                    </span>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Client Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Birth City
                    </label>
                    <div className="mt-1">
                      <LockingCityAutocomplete
                        value={birthPlace}
                        onSelect={setBirthPlace}
                        placeholder="Start typing birth city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={birthDateISO}
                      onChange={(e) => setBirthDateISO(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Timezone
                    </label>
                    <input
                      value={birthTimezone}
                      readOnly
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white/70 px-3 py-2.5 text-sm outline-none"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Auto-detected from selected birth city.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="+91..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="client@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Consultation Type
                    </label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    >
                      <option value="">Select type</option>
                      <option value="Marriage">Marriage</option>
                      <option value="Career">Career</option>
                      <option value="Finance">Finance</option>
                      <option value="Health">Health</option>
                      <option value="Property">Property</option>
                      <option value="Education">Education</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Client Status
                    </label>
                    <select
                      value={clientStatus}
                      onChange={(e) => {
                        const next = e.target.value as ClientStatus;
                        setClientStatus(next);
                        if (next !== "follow_up") setNextFollowUpDate("");
                      }}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    >
                      <option value="active">Active</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {clientStatus === "follow_up" ? (
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Next Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={nextFollowUpDate}
                        onChange={(e) => setNextFollowUpDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      />
                    </div>
                  ) : null}

                  <div className="xl:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Primary Issue
                    </label>
                    <textarea
                      value={primaryIssue}
                      onChange={(e) => setPrimaryIssue(e.target.value)}
                      className="mt-1 min-h-[90px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="Main concern: marriage delay, job change, money stress, health concern..."
                    />
                  </div>

                  <div className="xl:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Remedies Suggested
                    </label>
                    <textarea
                      value={remediesSuggested}
                      onChange={(e) => setRemediesSuggested(e.target.value)}
                      className="mt-1 min-h-[90px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="Mantra, donation, fasting, gemstone advice, lifestyle discipline..."
                    />
                  </div>

                  <div className="xl:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Next Action
                    </label>
                    <input
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="Call next week, send report, review dasha after 30 days..."
                    />
                  </div>

                  <div className="xl:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      General Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 min-h-[120px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                      placeholder="Initial context, referral, consultation type..."
                    />
                  </div>
                </div>

                {generatedChart ? (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    Chart generated successfully. Save now to create the client
                    profile and attach this birth chart.
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:justify-end">
                  <button
                    type="button"
                    onClick={handleGenerateClientChart}
                    disabled={generating}
                    className="rounded-xl border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  >
                    {generating ? "Generating..." : "Generate Chart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateClientWithChart}
                    disabled={saving}
                    className="rounded-xl bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Client + Chart"}
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
