import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

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
  /*
   * This function is called only after the API route has authenticated
   * the user. Use the server-only service client so RPC execution and
   * usage logging are not affected by browser-session RLS permissions.
   */
  const { data: creditSource, error: creditError } =
    await supabaseAdmin.rpc("consume_ask_sarathi_credit", {
      p_user_id: userId,
    });

  if (creditError) {
    console.error("ASK_CREDIT_CONSUMPTION_ERROR", {
      userId,
      message: creditError.message,
      details: creditError.details,
      hint: creditError.hint,
      code: creditError.code,
    });

    throw new Error("Unable to consume Ask Sārathi credit.");
  }

  if (
    creditSource !== "free" &&
    creditSource !== "purchased" &&
    creditSource !== "unlimited"
  ) {
    throw new Error("No Ask Sārathi credits remaining.");
  }

  const { error: usageError } = await supabaseAdmin
    .from("question_usage")
    .insert({
      user_id: userId,
      question,
      topic: topic ?? null,
    });

  if (usageError) {
    /*
     * The credit has already been consumed. Log this failure, but do
     * not give the customer another free question because the audit
     * insert failed.
     */
    console.error("QUESTION_USAGE_LOG_ERROR", {
      userId,
      message: usageError.message,
      details: usageError.details,
      hint: usageError.hint,
      code: usageError.code,
    });
  }

  console.log("ASK_CREDIT_CONSUMED", {
    userId,
    creditSource,
  });

  return {
    creditSource:
      creditSource as "free" | "purchased" | "unlimited",
  };
}