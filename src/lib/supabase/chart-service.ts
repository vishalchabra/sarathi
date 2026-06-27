import { createClient } from "@/lib/supabase/client";

export type UserChartRow = {
  id: string;
  user_id: string;
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

export type SaveUserChartInput = {
  chartName?: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName?: string;
};

export async function getCurrentUserChart(): Promise<UserChartRow | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_charts")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserChartRow | null;
}

export async function upsertCurrentUserChart(
  input: SaveUserChartInput
): Promise<UserChartRow> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    throw new Error("Not logged in.");
  }

  const payload = {
    user_id: user.id,
    chart_name: input.chartName ?? "My Chart",
    birth_date_iso: input.birthDateISO,
    birth_time: input.birthTime,
    birth_tz: input.birthTz,
    lat: input.lat,
    lon: input.lon,
    place_name: input.placeName ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_charts")
    .upsert(payload, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserChartRow;
}
export type SavedBirthProfileRow = {
  id: string;
  user_id: string;
  label: string;
  name: string;
  birth_date_iso: string;
  birth_time: string;
  birth_tz: string;
  lat: number;
  lon: number;
  place_name: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedBirthProfile = {
  id: string;
  label: string;
  name: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName: string;
};

export type SaveBirthProfileInput = {
  label: string;
  name: string;
  birthDateISO: string;
  birthTime: string;
  birthTz: string;
  lat: number;
  lon: number;
  placeName?: string;
};

function mapSavedBirthProfile(row: SavedBirthProfileRow): SavedBirthProfile {
  return {
    id: row.id,
    label: row.label,
    name: row.name,
    birthDateISO: row.birth_date_iso,
    birthTime: row.birth_time,
    birthTz: row.birth_tz,
    lat: row.lat,
    lon: row.lon,
    placeName: row.place_name ?? "",
  };
}

export async function getUserBirthProfiles(): Promise<SavedBirthProfile[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_birth_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as SavedBirthProfileRow[]).map(mapSavedBirthProfile);
}

export async function saveUserBirthProfile(
  input: SaveBirthProfileInput
): Promise<SavedBirthProfile> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    throw new Error("Not logged in.");
  }

  const payload = {
    user_id: user.id,
    label: input.label,
    name: input.name,
    birth_date_iso: input.birthDateISO,
    birth_time: input.birthTime,
    birth_tz: input.birthTz,
    lat: input.lat,
    lon: input.lon,
    place_name: input.placeName ?? null,
    updated_at: new Date().toISOString(),
  };

 const { data, error } = await supabase
  .from("saved_birth_profiles")
 .upsert(payload, {
  onConflict: "user_id,name",
})
  .select()
  .single();

  if (error) throw error;

  return mapSavedBirthProfile(data as SavedBirthProfileRow);
}