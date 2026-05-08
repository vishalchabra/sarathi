"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addConsultationNote,
  getAstrologerClient,
  updateAstrologerClient,
  type AstrologerClient,
  type ClientChart,
  type ConsultationNote,
} from "@/lib/supabase/astrologer-crm-service";

function StatusChip({ status }: { status?: string | null }) {
  const label =
    status === "follow_up"
      ? "Follow-up"
      : status === "closed"
      ? "Closed"
      : status === "vip"
      ? "VIP"
      : "Active";

  const cls =
    status === "follow_up"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : status === "closed"
      ? "border-slate-200 bg-slate-50 text-slate-600"
      : status === "vip"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <span className={["inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", cls].join(" ")}>
      {label}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}

function CaseBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {value?.trim() || "—"}
      </div>
    </div>
  );
}

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = React.use(params);

  const [client, setClient] = useState<AstrologerClient | null>(null);
  const [charts, setCharts] = useState<ClientChart[]>([]);
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [savingClient, setSavingClient] = useState(false);

const [editStatus, setEditStatus] = useState("active");
const [editVip, setEditVip] = useState(false);
const [showEditCase, setShowEditCase] = useState(false);
const [editFollowUpDate, setEditFollowUpDate] = useState("");
const [editNextAction, setEditNextAction] = useState("");
const [editPrimaryIssue, setEditPrimaryIssue] = useState("");
const [editRemediesSuggested, setEditRemediesSuggested] = useState("");
const [editNotes, setEditNotes] = useState("");
  const [error, setError] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const latestChart = useMemo(() => charts[0] ?? null, [charts]);

  async function loadClient() {
    try {
      setLoading(true);
      setError("");

      const result = await getAstrologerClient(clientId);

      setClient(result.client);
      setCharts(result.charts);
      setNotes(result.notes);
      if (result.client) {
        setEditVip(result.client.is_vip || false);
  setEditStatus(result.client.client_status || "active");
  setEditFollowUpDate(result.client.next_follow_up_date || "");
  setEditNextAction(result.client.next_action || "");
  setEditPrimaryIssue(result.client.primary_issue || "");
  setEditRemediesSuggested(result.client.remedies_suggested || "");
  setEditNotes(result.client.notes || "");
}
    } catch (e: any) {
      setError(e?.message || "Failed to load client.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClient();
  }, [clientId]);

  async function handleAddNote() {
    if (!note.trim()) {
      setError("Please enter consultation note.");
      return;
    }

    try {
      setSavingNote(true);
      setError("");

      await addConsultationNote({
        clientId,
        title: noteTitle,
        note,
        followUpDate,
      });

      setNoteTitle("");
      setNote("");
      setFollowUpDate("");

      await loadClient();
    } catch (e: any) {
      setError(e?.message || "Failed to save note.");
    } finally {
      setSavingNote(false);
    }
  }
async function handleUpdateClient() {
  try {
    setSavingClient(true);
    setError("");

    await updateAstrologerClient({
      clientId,
      clientStatus: editStatus,
      nextFollowUpDate: editStatus === "follow_up" ? editFollowUpDate : "",
      nextAction: editNextAction,
      primaryIssue: editPrimaryIssue,
      remediesSuggested: editRemediesSuggested,
      notes: editNotes,
      isVip: editVip,
    });

    await loadClient();
  } catch (e: any) {
    setError(e?.message || "Failed to update client.");
  } finally {
    setSavingClient(false);
  }
}
  return (
    <main className="min-h-screen astro-bg text-slate-800">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="space-y-6">
          <div className="rounded-3xl astro-card p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Premier Client Case
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {loading ? "Loading..." : client?.name ?? "Client not found"}
                  </h1>
                  {client ? <StatusChip status={client.client_status} /> : null}
                  {client?.consultation_type ? (
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                      {client.consultation_type}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Case profile with saved birth charts, remedies, notes, and follow-up references.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sarathi/data-engine/clients"
                  className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Back to Clients
                </Link>

                <Link
                  href={`/sarathi/data-engine?clientId=${clientId}`}
                  className="rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                >
                  Open in Data Engine
                </Link>
              </div>
            </div>

            {client ? (
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                <InfoCard label="Phone" value={client.phone} />
                <InfoCard label="Email" value={client.email} />
                <InfoCard label="Saved Items" value={`${charts.length} charts • ${notes.length} notes`} />
                <InfoCard label="Next Follow-up" value={client.next_follow_up_date} />
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Case Summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              Details captured when the astrologer saved this case from the Data Engine.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <CaseBlock label="Primary Issue" value={client?.primary_issue} />
              <CaseBlock label="Remedies Suggested" value={client?.remedies_suggested} />
              <CaseBlock label="Next Action" value={client?.next_action} />
              <CaseBlock label="General Notes" value={client?.notes} />
            </div>
          </section>
<section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
  <div className="flex items-center justify-between gap-3">
    <div>
      <h2 className="text-base font-semibold text-slate-900">
        Edit Client Case
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Update status, follow-up, remedies, and case notes only when needed.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowEditCase((v) => !v)}
      className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {showEditCase ? "Hide Edit" : "Edit Case"}
    </button>
  </div>

  {showEditCase ? (
    <>
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Client Status
          </label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
          >
            <option value="active">Active</option>
            <option value="follow_up">Follow-up</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <input
            type="checkbox"
            checked={editVip}
            onChange={(e) => setEditVip(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-semibold text-amber-800">
              Mark as VIP Client
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-amber-700">
              VIP clients can be prioritized for deeper review, remedy tracking,
              important-date reminders, and faster follow-ups.
            </span>
          </span>
        </label>

        {editStatus === "follow_up" ? (
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Follow-up Date
            </label>
            <input
              type="date"
              value={editFollowUpDate}
              onChange={(e) => setEditFollowUpDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
            />
          </div>
        ) : null}

        <div className="xl:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Next Action
          </label>
          <input
            value={editNextAction}
            onChange={(e) => setEditNextAction(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
            placeholder="Call next week, send report, review remedies..."
          />
        </div>

        <div className="xl:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Primary Issue
          </label>
          <textarea
            value={editPrimaryIssue}
            onChange={(e) => setEditPrimaryIssue(e.target.value)}
            className="mt-1 min-h-[90px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div className="xl:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Remedies Suggested
          </label>
          <textarea
            value={editRemediesSuggested}
            onChange={(e) => setEditRemediesSuggested(e.target.value)}
            className="mt-1 min-h-[90px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
          />
        </div>

        <div className="xl:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            General Notes
          </label>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            className="mt-1 min-h-[110px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleUpdateClient}
        disabled={savingClient}
        className="mt-5 w-full rounded-xl bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
      >
        {savingClient ? "Updating..." : "Update Client Case"}
      </button>
    </>
  ) : null}
</section>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Saved Birth Charts</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Charts saved from the Data Engine for this client.
                  </p>
                </div>

                {latestChart ? (
                  <Link
                    href={`/sarathi/data-engine?clientId=${clientId}`}
                    className="rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Reopen Chart
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
                {loading ? (
                  <div className="p-5 text-sm text-slate-500">Loading charts...</div>
                ) : null}

                {!loading && !charts.length ? (
                  <div className="p-5 text-sm text-slate-500">
                    No charts saved yet. Open the Data Engine and save a chart to this client.
                  </div>
                ) : null}

                {!loading && charts.length ? (
                  <div className="divide-y divide-[color:var(--border)]">
                    {charts.map((chart) => (
                      <div key={chart.id} className="p-4">
                        <div className="font-semibold text-slate-900">
                          {chart.chart_name || "Birth Chart"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {chart.birth_date_iso} • {chart.birth_time} • {chart.place_name || "—"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {chart.birth_tz} • {chart.lat}, {chart.lon}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Add Consultation / Follow-up Note
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add new notes after calls, follow-ups, or remedy reviews.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Title
                  </label>
                  <input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    placeholder="Follow-up call / Remedy review / Career consultation"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 min-h-[150px] w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                    placeholder="Consultation notes..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[color:var(--primary)]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={savingNote}
                  className="w-full rounded-xl bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {savingNote ? "Saving Note..." : "Save Note"}
                </button>
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Consultation Notes Timeline</h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
              {loading ? (
                <div className="p-5 text-sm text-slate-500">Loading notes...</div>
              ) : null}

              {!loading && !notes.length ? (
                <div className="p-5 text-sm text-slate-500">
                  No follow-up notes yet. The case summary above contains the initial issue, remedies, and general notes.
                </div>
              ) : null}

              {!loading && notes.length ? (
                <div className="divide-y divide-[color:var(--border)]">
                  {notes.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {item.title || "Consultation Note"}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {new Date(item.created_at).toLocaleDateString("en-GB")}
                          </div>
                        </div>

                        {item.follow_up_date ? (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Follow-up: {item.follow_up_date}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{item.note}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
