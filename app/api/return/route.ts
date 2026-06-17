import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPostEncounterEmail } from "@/utils/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const q5NonNegotiable = body.q5NonNegotiable;
    const q1Completed = body.q1Completed ?? body.q1_completed ?? null;
    const q2Resistance = body.q2Resistance ?? body.q2_resistance ?? null;
    const q3Changed = body.q3Changed ?? body.q3_changed ?? null;
    const q4TruthRevealed = body.q4TruthRevealed ?? body.q4_truth_revealed ?? null;
    const userId = body.user_id ?? body.userId ?? null;
    const sessionId = body.sessionId ?? body.session_id ?? null;
    const encounterQuestion = body.encounterQuestion ?? body.encounter_question ?? null;

    if (!email || !q5NonNegotiable) {
      return NextResponse.json(
        { ok: false, error: "Missing email or q5NonNegotiable" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { ok: false, error: "Supabase environment variables missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Write to returns table — all five fields
    const { error: returnsError } = await supabase.from("returns").insert({
      email,
      user_id: userId,
      session_id: sessionId,
      encounter_question: encounterQuestion,
      q1_completed: q1Completed,
      q2_resistance: q2Resistance,
      q3_changed: q3Changed,
      q4_truth_revealed: q4TruthRevealed,
      q5_non_negotiable: q5NonNegotiable,
    });

    if (returnsError) {
      console.error("Returns table insert error:", returnsError);
    }

    // Send Email 1 immediately
    const emailOne = await sendPostEncounterEmail({
      email,
      q5NonNegotiable,
    });

    // Schedule Day 3 and Day 7 with all five fields
    const day3 = new Date();
    day3.setDate(day3.getDate() + 3);

    const day7 = new Date();
    day7.setDate(day7.getDate() + 7);

    const { error: scheduleError } = await supabase
      .from("scheduled_emails")
      .insert([
        {
          email,
          session_id: sessionId,
          q5_non_negotiable: q5NonNegotiable,
          q1_completed: q1Completed,
          q2_resistance: q2Resistance,
          q3_changed: q3Changed,
          q4_truth_revealed: q4TruthRevealed,
          email_type: "day3",
          send_at: day3.toISOString(),
          status: "pending",
        },
        {
          email,
          session_id: sessionId,
          q5_non_negotiable: q5NonNegotiable,
          q1_completed: q1Completed,
          q2_resistance: q2Resistance,
          q3_changed: q3Changed,
          q4_truth_revealed: q4TruthRevealed,
          email_type: "day7",
          send_at: day7.toISOString(),
          status: "pending",
        },
      ]);

    if (scheduleError) {
      console.error("Scheduled email insert error:", scheduleError);
    }

    return NextResponse.json({
      ok: true,
      emailOne,
      scheduled: !scheduleError,
    });
  } catch (error) {
    console.error("Return route error:", error);

    return NextResponse.json(
      { ok: false, error: "Return route failed" },
      { status: 500 }
    );
  }
}