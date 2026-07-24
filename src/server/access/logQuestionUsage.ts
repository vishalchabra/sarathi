import "server-only";
import { createClient } from "@/lib/supabase/server";

type LogQuestionUsageParams = {
  userId: string;
  question: string;
  topic?: string | null;
};

export async function logQuestionUsage({
  userId,
  question,
  topic,
}: LogQuestionUsageParams) {
  const supabase = await createClient();

  const { data: creditSource, error: creditError } =
    await supabase.rpc("consume_ask_sarathi_credit", {
      p_user_id: userId,
    });

  if (creditError) {
    console.error("ASK_CREDIT_CONSUMPTION_ERROR", creditError);
    throw new Error("Unable to record Ask Sārathi credit usage.");
  }

  if (creditSource === "none") {
    throw new Error("No Ask Sārathi credits remaining.");
  }

  const { error: usageError } = await supabase
    .from("question_usage")
    .insert({
      user_id: userId,
      question,
      topic: topic ?? null,
    });

  if (usageError) {
    console.error("QUESTION_USAGE_LOG_ERROR", usageError);
  }

  return {
    creditSource:
      creditSource as "free" | "purchased" | "unlimited",
  };
}