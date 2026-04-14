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