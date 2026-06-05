import { NextResponse } from "next/server";
import {
  sendPostEncounterEmail,
  sendDayThreeEmail,
  sendDaySevenEmail,
} from "@/utils/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email;
    const q5NonNegotiable = body.q5NonNegotiable;

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

    const emailTwo = await sendDayThreeEmail({
  email,
  q5NonNegotiable,
});

    const emailThree = await sendDaySevenEmail({
  email,
  q5NonNegotiable,
});

    return NextResponse.json({
      ok: true,
      emailOne,
      emailTwo,
      emailThree,
    });
  } catch (error) {
    console.error("Return route error:", error);

    return NextResponse.json(
      { ok: false, error: "Return route failed" },
      { status: 500 }
    );
  }
}