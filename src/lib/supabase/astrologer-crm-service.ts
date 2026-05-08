import { createClient } from "@/lib/supabase/client";

export type AstrologerClient = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  primary_issue: string | null;
  consultation_type: string | null;
  remedies_suggested: string | null;
  client_status: string | null;
  next_action: string | null;
  next_follow_up_date: string | null;
  is_vip: boolean | null;
  vip_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientChart = {
  id: string;
  user_id: string;
  client_id: string;
  chart_name: string | null;
  birth_date_iso: string;
  birth_time: string;
  birth_tz: string;
  lat: number;
  lon: number;
  place_name: string | null;
  created_at: string;
  updated_at: string;
};

export type ConsultationNote = {
  id: string;
  user_id: string;
  client_id: string;
  title: string | null;
  note: string;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAstrologerClientInput = {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  primaryIssue?: string;
  consultationType?: string;
  remediesSuggested?: string;
  clientStatus?: string;
  nextAction?: string;
  nextFollowUpDate?: string;
  isVip?: boolean;
};

async function getUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Not logged in.");

  return user.id;
}

export async function listAstrologerClients(): Promise<AstrologerClient[]> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("astrologer_clients")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AstrologerClient[];
}

export async function createAstrologerClient(
  input: CreateAstrologerClientInput
): Promise<AstrologerClient> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("astrologer_clients")
    .insert({
      user_id: userId,
      name: input.name.trim(),
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
      primary_issue: input.primaryIssue?.trim() || null,
      consultation_type: input.consultationType?.trim() || null,
      remedies_suggested: input.remediesSuggested?.trim() || null,
      client_status: input.clientStatus?.trim() || "active",
      next_action: input.nextAction?.trim() || null,
      next_follow_up_date: input.nextFollowUpDate?.trim() || null,
      is_vip: Boolean(input.isVip),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as AstrologerClient;
}

export async function getAstrologerClient(clientId: string): Promise<{
  client: AstrologerClient | null;
  charts: ClientChart[];
  notes: ConsultationNote[];
}> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data: client, error: clientError } = await supabase
    .from("astrologer_clients")
    .select("*")
    .eq("user_id", userId)
    .eq("id", clientId)
    .maybeSingle();

  if (clientError) throw clientError;

  const { data: charts, error: chartsError } = await supabase
    .from("astrologer_client_charts")
    .select("*")
    .eq("user_id", userId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (chartsError) throw chartsError;

  const { data: notes, error: notesError } = await supabase
    .from("astrologer_consultation_notes")
    .select("*")
    .eq("user_id", userId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (notesError) throw notesError;

  return {
    client: client as AstrologerClient | null,
    charts: (charts ?? []) as ClientChart[],
    notes: (notes ?? []) as ConsultationNote[],
  };
}

export async function addClientChart(input: {
  clientId: string;
  chartName?: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName?: string;
}): Promise<ClientChart> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("astrologer_client_charts")
    .insert({
      user_id: userId,
      client_id: input.clientId,
      chart_name: input.chartName?.trim() || "Birth Chart",
      birth_date_iso: input.birthDateISO,
      birth_time: input.birthTime,
      birth_tz: input.birthTz,
      lat: input.lat,
      lon: input.lon,
      place_name: input.placeName?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as ClientChart;
}

export async function addConsultationNote(input: {
  clientId: string;
  title?: string;
  note: string;
  followUpDate?: string;
}): Promise<ConsultationNote> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("astrologer_consultation_notes")
    .insert({
      user_id: userId,
      client_id: input.clientId,
      title: input.title?.trim() || null,
      note: input.note.trim(),
      follow_up_date: input.followUpDate?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as ConsultationNote;
}

export async function listUpcomingFollowUps(): Promise<ConsultationNote[]> {
  const supabase = createClient();
  const userId = await getUserId();

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("astrologer_consultation_notes")
    .select("*")
    .eq("user_id", userId)
    .not("follow_up_date", "is", null)
    .gte("follow_up_date", today)
    .order("follow_up_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ConsultationNote[];
}
export async function updateAstrologerClient(input: {
  clientId: string;
  clientStatus?: string;
  nextFollowUpDate?: string;
  isVip?: boolean;
  vipReason?: string;
  nextAction?: string;
  primaryIssue?: string;
  remediesSuggested?: string;
  notes?: string;
}): Promise<AstrologerClient> {
  const supabase = createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("astrologer_clients")
    .update({
      client_status: input.clientStatus?.trim() || "active",
      next_follow_up_date: input.nextFollowUpDate?.trim() || null,
      is_vip: Boolean(input.isVip),
      vip_reason: input.vipReason?.trim() || null,
      next_action: input.nextAction?.trim() || null,
      primary_issue: input.primaryIssue?.trim() || null,
      remedies_suggested: input.remediesSuggested?.trim() || null,
      notes: input.notes?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("id", input.clientId)
    .select()
    .single();

  if (error) throw error;
  return data as AstrologerClient;
}