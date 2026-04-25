import {
  classifyResponse,
  buildNextInstruction,
  determineAction,
  determineDoor,
} from "@/utils/flow";

import { sendReturnNotification } from "@/utils/email";

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

    const pathway =
      action_type === "manual_review" ? "guided-support" : "self-directed";

    const next_instruction = buildNextInstruction({
      door,
      pathway,
      response_category,
    });

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