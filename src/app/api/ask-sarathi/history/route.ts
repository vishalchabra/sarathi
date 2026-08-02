import "server-only";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type SaveHistoryBody = {
  question?: unknown;
  topic?: unknown;
  answer?: unknown;
  profileName?: unknown;
};

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/*
 * Load the signed-in user's saved Ask Sārathi history.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          reason: "login_required",
          error: "Please sign in to view your history.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("ask_sarathi_history")
      .select(
        [
          "id",
          "question",
          "topic",
          "answer_json",
          "profile_name",
          "created_at",
          "updated_at",
        ].join(",")
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(100);

    if (error) {
      throw new Error(
        `Unable to load Ask Sārathi history: ${error.message}`
      );
    }

    return NextResponse.json({
      ok: true,
      history: data ?? [],
    });
  } catch (error) {
    console.error("ASK_SARATHI_HISTORY_GET_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Your Ask Sārathi history could not be loaded.",
      },
      { status: 500 }
    );
  }
}

/*
 * Save one successful question and its complete response.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          reason: "login_required",
          error: "Please sign in to save your history.",
        },
        { status: 401 }
      );
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as SaveHistoryBody;

    const question = cleanText(body.question);
    const topic = cleanText(body.topic) || null;
    const profileName = cleanText(body.profileName) || null;

    const answer =
      body.answer &&
      typeof body.answer === "object" &&
      !Array.isArray(body.answer)
        ? body.answer
        : null;

    if (!question) {
      return NextResponse.json(
        {
          ok: false,
          error: "A question is required.",
        },
        { status: 400 }
      );
    }

    if (!answer) {
      return NextResponse.json(
        {
          ok: false,
          error: "A valid Sārathi response is required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("ask_sarathi_history")
      .insert({
        user_id: user.id,
        question,
        topic,
        answer_json: answer,
        profile_name: profileName,
      })
      .select(
        [
          "id",
          "question",
          "topic",
          "answer_json",
          "profile_name",
          "created_at",
          "updated_at",
        ].join(",")
      )
      .single();

    if (error) {
      throw new Error(
        `Unable to save Ask Sārathi history: ${error.message}`
      );
    }

    return NextResponse.json({
      ok: true,
      item: data,
    });
  } catch (error) {
    console.error("ASK_SARATHI_HISTORY_POST_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Your Ask Sārathi response could not be saved.",
      },
      { status: 500 }
    );
  }
}

/*
 * Delete one saved history item belonging to the signed-in user.
 *
 * Request body:
 * {
 *   "id": "history-row-uuid"
 * }
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          reason: "login_required",
          error: "Please sign in to delete history.",
        },
        { status: 401 }
      );
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as {
      id?: unknown;
    };

    const historyId = cleanText(body.id);

    if (!historyId) {
      return NextResponse.json(
        {
          ok: false,
          error: "A history item ID is required.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("ask_sarathi_history")
      .delete()
      .eq("id", historyId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(
        `Unable to delete Ask Sārathi history: ${error.message}`
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("ASK_SARATHI_HISTORY_DELETE_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "The saved answer could not be deleted.",
      },
      { status: 500 }
    );
  }
}