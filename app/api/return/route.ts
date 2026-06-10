import { NextResponse } from "next/server";
import { sendPostEncounterEmail } from "@/utils/resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const q5NonNegotiable = body.q5NonNegotiable;

    const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

    if (!email || !q5NonNegotiable) {
      return NextResponse.json(
        { ok: false, error: "Missing email or q5NonNegotiable" },
        { status: 400 }
      );
    }

    const emailOne = await sendPostEncounterEmail({
      email,
      q5NonNegotiable,
    });

const day3 = new Date();
day3.setDate(day3.getDate() + 3);

const day7 = new Date();
day7.setDate(day7.getDate() + 7);

const { error: scheduleError } = await supabase.from("scheduled_emails").insert([
  {
    email,
    q5_non_negotiable: q5NonNegotiable,
    email_type: "day3",
    send_at: day3.toISOString(),
    status: "pending",
  },
  {
    email,
    q5_non_negotiable: q5NonNegotiable,
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
    });
  } catch (error) {
    console.error("Return route error:", error);

    return NextResponse.json(
      { ok: false, error: "Return route failed" },
      { status: 500 }
    );
  }
}