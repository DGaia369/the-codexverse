import nodemailer from "nodemailer";

type ReturnNotificationInput = {
  email: string;
  q1Completed: string;
  q2Resistance: string;
  q3Changed: string;
  q4TruthRevealed: string;
  q5NonNegotiable: string;
  response_category: string;
  action_type: string;
  door: string;
  pathway: string;
  next_instruction: string;
  session_id: string;
};

export async function sendReturnNotification(input: ReturnNotificationInput) {
  const {
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
  } = input;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;
  const to = "hello@thecodexverse.com";

  if (!host || !port || !user || !pass || !from) {
    console.log("Email skipped: SMTP environment variables are not fully configured.");
    return { ok: false, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  const subject = `New the codeXverse™ Return | ${door} | ${pathway}`;

  const text = `
A new return has been submitted.

Session ID: ${session_id}
User Email: ${email}

Door: ${door}
Pathway: ${pathway}
Response Category: ${response_category}
Action Type: ${action_type}

Next Instruction:
${next_instruction}

Responses:
1. What have you completed?
${q1Completed}

2. What resistance showed up?
${q2Resistance}

3. What changed?
${q3Changed}

4. What truth did this reveal?
${q4TruthRevealed}

5. What is now non-negotiable?
${q5NonNegotiable}
`.trim();

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
    console.log("Internal notification sent successfully.");
    return { ok: true };
  } catch (err) {
    console.error("Internal notification send error:", err);
    return { ok: false, error: err };
  }
}