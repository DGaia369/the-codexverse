import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendPostEncounterEmail } from "@/utils/resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
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

    // Validation: email and q5NonNegotiable are required
    if (!email || !q5NonNegotiable) {
      return NextResponse.json(
        { error: "email and q5NonNegotiable are required" },
        { status: 400 }
      );
    }

    // Write all five fields to the returns table
    const { error: returnError } = await supabase.from("returns").insert({
      email,
      user_id: user_id ?? null,
      session_id: session_id ?? null,
      q1_completed: q1Completed ?? null,
      q2_resistance: q2Resistance ?? null,
      q3_changed: q3Changed ?? null,
      q4_truth_revealed: q4TruthRevealed ?? null,
      q5_non_negotiable: q5NonNegotiable,
      encounter_question: null, // populated downstream if needed
    });

    if (returnError) {
      console.error("returns insert error:", returnError);
      return NextResponse.json(
        { error: "Failed to save return data" },
        { status: 500 }
      );
    }

    // Schedule Day 3 email (3 days from now)
    const day3SendAt = new Date();
    day3SendAt.setDate(day3SendAt.getDate() + 3);

    const { error: day3Error } = await supabase
      .from("scheduled_emails")
      .insert({
        email,
        email_type: "day_3",
        send_at: day3SendAt.toISOString(),
        status: "pending",
        session_id: session_id ?? null,
        q1_completed: q1Completed ?? null,
        q2_resistance: q2Resistance ?? null,
        q3_changed: q3Changed ?? null,
        q4_truth_revealed: q4TruthRevealed ?? null,
        q5_non_negotiable: q5NonNegotiable,
      });

    if (day3Error) {
      console.error("Day 3 schedule error:", day3Error);
    }

    // Schedule Day 7 email (7 days from now)
    const day7SendAt = new Date();
    day7SendAt.setDate(day7SendAt.getDate() + 7);

    const { error: day7Error } = await supabase
      .from("scheduled_emails")
      .insert({
        email,
        email_type: "day_7",
        send_at: day7SendAt.toISOString(),
        status: "pending",
        session_id: session_id ?? null,
        q1_completed: q1Completed ?? null,
        q2_resistance: q2Resistance ?? null,
        q3_changed: q3Changed ?? null,
        q4_truth_revealed: q4TruthRevealed ?? null,
        q5_non_negotiable: q5NonNegotiable,
      });

    if (day7Error) {
      console.error("Day 7 schedule error:", day7Error);
    }

    // Send Email 1 immediately
    const { error: emailError } = await sendPostEncounterEmail({
      email,
      q5NonNegotiable,
      q1Completed,
      q2Resistance,
      q3Changed,
      q4TruthRevealed,
    });

    if (emailError) {
      console.error("Email 1 send error:", emailError);
      // Not a fatal error — return data is saved, emails are scheduled
    }

    return NextResponse.json({
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
      { error: "Unexpected error in return route" },
      { status: 500 }
    );
  }
}
