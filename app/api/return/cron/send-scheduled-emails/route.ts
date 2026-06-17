import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDayThreeEmail, sendDaySevenEmail } from "@/utils/resend";

export async function GET() {
  return processScheduledEmails();
}

export async function POST() {
  return processScheduledEmails();
}

async function processScheduledEmails() {
  try {
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

    const { data: dueEmails, error: fetchError } = await supabase
      .from("scheduled_emails")
      .select(
        "id,email,email_type,q5_non_negotiable,q1_completed,q2_resistance,q3_changed,q4_truth_revealed,send_at,status"
      )
      .eq("status", "pending")
      .lte("send_at", new Date().toISOString())
      .order("send_at", { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error("Scheduled email fetch error:", fetchError);

      return NextResponse.json(
        { ok: false, error: "Failed to fetch scheduled emails" },
        { status: 500 }
      );
    }

    if (!dueEmails || dueEmails.length === 0) {
      return NextResponse.json({
        ok: true,
        processed: 0,
        message: "No due scheduled emails found.",
      });
    }

    const results = [];

    for (const scheduledEmail of dueEmails) {
      try {
        let sendResult;

        if (scheduledEmail.email_type === "day3") {
          sendResult = await sendDayThreeEmail({
            email: scheduledEmail.email,
            q5NonNegotiable: scheduledEmail.q5_non_negotiable ?? "",
            q1Completed: scheduledEmail.q1_completed ?? undefined,
          });
        } else if (scheduledEmail.email_type === "day7") {
          sendResult = await sendDaySevenEmail({
            email: scheduledEmail.email,
            q5NonNegotiable: scheduledEmail.q5_non_negotiable ?? "",
            q3Changed: scheduledEmail.q3_changed ?? undefined,
          });
        } else {
          throw new Error(`Unknown email_type: ${scheduledEmail.email_type}`);
        }

       const sendOutcome = sendResult as {
  ok?: boolean;
  error?: unknown;
} | null | undefined;

if (!sendOutcome?.ok) {
  const sendError = sendOutcome?.error ?? "Unknown send error";

  throw new Error(
    typeof sendError === "string"
      ? sendError
      : JSON.stringify(sendError)
  );
}

        const { error: updateError } = await supabase
          .from("scheduled_emails")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            error: null,
          })
          .eq("id", scheduledEmail.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          id: scheduledEmail.id,
          email: scheduledEmail.email,
          email_type: scheduledEmail.email_type,
          status: "sent",
        });
      } catch (sendError) {
        console.error("Scheduled email send error:", sendError);

        const errorMessage =
          sendError instanceof Error
            ? sendError.message
            : JSON.stringify(sendError);

        await supabase
          .from("scheduled_emails")
          .update({
            status: "failed",
            error: errorMessage,
          })
          .eq("id", scheduledEmail.id);

        results.push({
          id: scheduledEmail.id,
          email: scheduledEmail.email,
          email_type: scheduledEmail.email_type,
          status: "failed",
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Scheduled email processor failed:", error);

    return NextResponse.json(
      { ok: false, error: "Scheduled email processor failed" },
      { status: 500 }
    );
  }
}