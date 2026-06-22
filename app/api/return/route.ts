import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendPostEncounterEmail } from "@/utils/resend";

let supabaseClient: any = null;

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, serviceRoleKey);
  }

  return supabaseClient;
}
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();

    const {
      q1Completed,
      q2Resistance,
      q3Changed,
      q4TruthRevealed,
      q5NonNegotiable,
      email,
      user_id,
      session_id,
    } = body;

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    // Validation: email and q5NonNegotiable are required
    if (!normalizedEmail || !q5NonNegotiable) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "email and q5NonNegotiable are required",
        },
        { status: 400 }
      );
    }

    /*
      Light duplicate protection:
      If the same email submits the same non-negotiable answer within 10 minutes,
      do not send Email #1 again.
    */
    let duplicateQuery = supabase
      .from("returns")
      .select("id, created_at")
      .eq("email", normalizedEmail)
      .eq("q5_non_negotiable", q5NonNegotiable)
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (session_id) {
      duplicateQuery = duplicateQuery.eq("session_id", session_id);
    }

    const { data: existingReturn, error: duplicateCheckError } =
      await duplicateQuery;

    if (duplicateCheckError) {
      console.error("Duplicate check error:", duplicateCheckError);
      // Do not block the participant if duplicate check fails.
    }

    if (existingReturn && existingReturn.length > 0) {
      return NextResponse.json({
        ok: true,
        success: true,
        duplicate: true,
        email1Sent: false,
        scheduled: {
          day3: "not_queued_duplicate",
          day7: "not_queued_duplicate",
        },
        redirect: "/return-complete",
      });
    }

    // Write all five fields to the returns table
    const { error: returnError } = await supabase.from("returns").insert({
      email: normalizedEmail,
      user_id: user_id ?? null,
      session_id: session_id ?? null,
      q1_completed: q1Completed ?? null,
      q2_resistance: q2Resistance ?? null,
      q3_changed: q3Changed ?? null,
      q4_truth_revealed: q4TruthRevealed ?? null,
      q5_non_negotiable: q5NonNegotiable,
      encounter_question: null,
    });

    if (returnError) {
      console.error("returns insert error:", returnError);

      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "Failed to save return data",
        },
        { status: 500 }
      );
    }

    // Schedule Day 3 email
    const day3SendAt = new Date();
    day3SendAt.setDate(day3SendAt.getDate() + 3);

    const { error: day3Error } = await supabase
      .from("scheduled_emails")
      .insert({
        email: normalizedEmail,
        session_id: session_id ?? null,
        email_type: "day3",
        send_at: day3SendAt.toISOString(),
        status: "pending",
        q1_completed: q1Completed ?? null,
        q2_resistance: q2Resistance ?? null,
        q3_changed: q3Changed ?? null,
        q4_truth_revealed: q4TruthRevealed ?? null,
        q5_non_negotiable: q5NonNegotiable,
      });

    if (day3Error) {
      console.error("Day 3 schedule error:", day3Error);
    }

    // Schedule Day 7 email
    const day7SendAt = new Date();
    day7SendAt.setDate(day7SendAt.getDate() + 7);

    const { error: day7Error } = await supabase
      .from("scheduled_emails")
      .insert({
        email: normalizedEmail,
        session_id: session_id ?? null,
        email_type: "day7",
        send_at: day7SendAt.toISOString(),
        status: "pending",
        q1_completed: q1Completed ?? null,
        q2_resistance: q2Resistance ?? null,
        q3_changed: q3Changed ?? null,
        q4_truth_revealed: q4TruthRevealed ?? null,
        q5_non_negotiable: q5NonNegotiable,
      });

    if (day7Error) {
      console.error("Day 7 schedule error:", day7Error);
    }

    // Send Email 1 immediately.
    // Email failure is not fatal because the Return has already been saved.
    let emailError: unknown = null;

    try {
      const result = await sendPostEncounterEmail({
        email: normalizedEmail,
        q5NonNegotiable,
        q1Completed,
        q2Resistance,
        q3Changed,
        q4TruthRevealed,
      });

      emailError = result?.error ?? null;
    } catch (err) {
      emailError = err;
      console.error("Email 1 send threw an error:", err);
    }

    if (emailError) {
      console.error("Email 1 send error:", emailError);
    }

    return NextResponse.json({
      ok: true,
      success: true,
      scheduled: {
        day3: day3Error ? "failed" : "queued",
        day7: day7Error ? "failed" : "queued",
      },
      email1Sent: !emailError,
      redirect: "/return-complete",
    });
  } catch (err) {
    console.error("return route error:", err);

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Unexpected error in return route",
      },
      { status: 500 }
    );
  }
}