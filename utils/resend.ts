import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPostEncounterEmail({
  email,
  q5NonNegotiable,
}: {
  email: string;
  q5NonNegotiable: string;
}) {
  const { error } = await resend.emails.send({
    from: 'the codeXverse™ <no-reply@thecodexverse.com>',
    to: email,
    subject: 'Something real just happened.',
    html: `
      <div style="background-color:#000000;padding:48px 32px;font-family:Georgia,serif;max-width:480px;margin:0 auto;">
        
        <p style="color:#d7ba7d;font-size:11px;letter-spacing:0.3em;margin:0 0 40px 0;">
          the codeXverse™
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          You just sat with a question most people spend their whole lives avoiding.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          You did not look away.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          That is not nothing.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">
          You said something is now non-negotiable for you.
        </p>

        <p style="color:#d7ba7d;font-size:16px;font-style:italic;line-height:1.8;margin:0 0 40px 0;padding-left:16px;border-left:2px solid rgba(215,186,125,0.3);">
          "${q5NonNegotiable}"
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          Before you move back into your life — one question to carry with you:
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">
          What would it mean to actually keep the commitment you just made to yourself?
        </p>

        <p style="color:rgba(255,255,255,0.25);font-size:13px;line-height:1.8;margin:0 0 8px 0;font-style:italic;">
          The door does not close. It waits.
        </p>

        <p style="color:rgba(255,255,255,0.15);font-size:11px;line-height:1.8;margin:48px 0 0 0;">
          This is not therapy. It is not a substitute for professional support.<br/>
          If you are in crisis, please reach out to a qualified professional.
        </p>

      </div>
    `,
  });

console.log("Resend raw response — error:", error);
console.log("Resend API key present:", !!process.env.RESEND_API_KEY);
console.log("Sending to:", email);
console.log("q5 value received:", q5NonNegotiable);

  if (error) {
    console.error('Resend email error:', error);
    return { ok: false, error };
  }

  return { ok: true };
}