import {
  classifyResponse,
  determineAction,
  determineDoor,
  determinePathway,
  buildNextInstruction,
} from "@/utils/flow";

import { sendReturnNotification } from "@/utils/email";
import { sendPostEncounterEmail } from "@/utils/resend";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming data:", body);

    const {
      q1Completed,
      q2Resistance,
      q3Changed,
      q4TruthRevealed,
      q5NonNegotiable,
      email,
      user_id,
    } = body;

    const session_id = crypto.randomUUID();

    const response_category = classifyResponse({
      q1: q1Completed,
      q2: q2Resistance,
      q3: q3Changed,
      q4: q4TruthRevealed,
      q5: q5NonNegotiable,
      door: "unknown",
      pathway: "unknown",
    });

    const action_type = determineAction(response_category);

  const door = determineDoor(response_category);

  let pathway: string;

if (response_category === "needs_support") {
  pathway = "guided-support";
} else if (response_category === "needs_clarity") {
  pathway = "rebuild_foundation";
} else if (response_category === "ready_for_next_step") {
const options = ["next_step", "rise_gently", "restore_rhythm"];
pathway = options[Math.floor(Math.random() * options.length)];
} else {
  pathway = "self_directed";
}

    const next_instruction = buildNextInstruction({
      door,
      pathway,
      response_category,
    });

    const now = new Date();
    const unlockAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const status = "submitted";

    console.log("Computed ACT values:", {
      response_category,
      next_instruction,
      action_type,
      door,
      pathway,
      status,
      session_id,
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("TESTING COLUMN ACCESS");

const columnTest = await supabase
  .from("returns")
  .select("activation_committed")
  .limit(1);

console.log("COLUMN TEST RESULT:", columnTest);

    const { data, error } = await supabase.from("returns").insert([
      {
        q1_completed: q1Completed,
        q2_resistance: q2Resistance,
        q3_changed: q3Changed,
        q4_truth_revealed: q4TruthRevealed,
        q5_non_negotiable: q5NonNegotiable,
        email,
        action_type,
        door,
        pathway,
        status,
        session_id,
        response_category,
        next_instruction,

  activation_committed: true,
  activation_committed_at: now.toISOString(),
  activation_unlock_at: unlockAt.toISOString(),
  activation_completed: false,
  user_id: user_id || null,
      },
    ]);

    if (error) {
      console.error("API Supabase insert error:", error);
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

        try {
      await sendReturnNotification({
        email,
        q1Completed,
        q2Resistance,
        q3Changed,
        q4TruthRevealed,
        q5NonNegotiable,
        response_category,
        action_type,
        door,
        pathway,
        next_instruction,
        session_id,
      });
    } catch (emailError) {
      console.error("Email notification error:", emailError);
    }

     try {
  const result = await sendPostEncounterEmail({
    email,
    q5NonNegotiable,
    });
  console.log("Post-encounter email result:", JSON.stringify(result));
    } catch (postEncounterError) {
  console.error("Post-encounter email error:", postEncounterError);
  }

    return NextResponse.json({
      ok: true,
      data,
      routing: {
        door,
        pathway,
        status,
        session_id,
        response_category,
        next_instruction,
        action_type,
        activation_unlock_at: unlockAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}