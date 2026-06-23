import { Resend } from 'resend';
import { buildPersonalizedDeclaration } from './declarationBuilder';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// --- Randomization Pools ---

const openingPool = [
  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You just sat with a question most people spend their whole lives avoiding.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You did not look away.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">That is not nothing.</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You have been moving past this for a long time.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">Not because you did not feel it. Because stopping felt like something you could not afford.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">Today you stopped anyway. That is not a small thing. That is the beginning of something.</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">There is a version of today where you felt the pull of this and kept going.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">Where you told yourself later, maybe later.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">That did not happen.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">You stopped. You sat with it. You looked at it directly. The part of you that has been waiting for that, noticed.</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You did not arrive here by accident.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">Something in you has been pointing here for longer than today. You finally followed it.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">What it cost you to follow it, only you know. What it means that you did, you are only beginning to understand.</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">Most people spend their whole lives one step away from this conversation.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">Not because they are unwilling. Because no one ever created the conditions where it felt safe enough to begin.</p>
   <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">You began. That is everything.</p>`,
];

const framingPool = [
  `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">You said something is now non-negotiable for you.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">That word is not a small word. It means: this is where I stop trading myself away.</p>`,

  `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">You left here carrying something you did not have when you arrived.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">Not information. Not a framework. Not someone else's words about your life.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">Your own words. About your own truth. That belongs to you now. Permanently.</p>`,

  `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">Before you walked back into your life, something in you named what it is no longer willing to give up.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">That naming was not performance. It was recognition.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">And recognition, once it happens, does not unhappen.</p>`,

  `<p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">You named what you are no longer available to negotiate away.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">That is not a commitment to be perfect. It is a decision to notice when you are leaving yourself, and to come back.</p>
   <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.8;margin:0 0 16px 0;">The coming back is the practice. The practice is the change.</p>`,
];

const questionPool = [
  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">One question to carry with you:</p>
   <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">What would it mean to actually keep the commitment you just made to yourself?</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">One question to carry with you:</p>
   <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">Where in your life has this non-negotiable already been costing you, quietly, without a name? Now it has a name. What changes?</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">One question to carry with you:</p>
   <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">The person who wrote that commitment knows something. What is she asking you to do differently, starting today, not eventually?</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">One question to carry with you:</p>
   <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">You have honored everyone else's non-negotiables for a long time. What would it look like to honor your own with the same consistency? Not perfectly. Honestly.</p>`,

  `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">One question to carry with you:</p>
   <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">What has abandoning this cost you? Not to grieve it. To finally see it clearly enough to stop paying that cost.</p>`,
];

function pickFrom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Email 1: Same Day ---

export async function sendPostEncounterEmail({
  email,
  q5NonNegotiable,
  q1Completed,
  q2Resistance,
  q3Changed,
  q4TruthRevealed,
}: {
  email: string;
  q5NonNegotiable: string;
  q1Completed?: string;
  q2Resistance?: string;
  q3Changed?: string;
  q4TruthRevealed?: string;
}) {
  const opening = pickFrom(openingPool);
  const framing = pickFrom(framingPool);
  const question = pickFrom(questionPool);

  const fs = await import('fs');
  const path = await import('path');
  const declarationPath = path.join(process.cwd(), 'public', 'declaration.pdf');
  const baseDeclarationBuffer = fs.readFileSync(declarationPath);

  let attachmentBuffer: Buffer;

  try {
    attachmentBuffer = await buildPersonalizedDeclaration(baseDeclarationBuffer, {
      q1Completed,
      q2Resistance,
      q3Changed,
      q4TruthRevealed,
      q5NonNegotiable,
    });
  } catch (personalizationError) {
    console.error('Declaration personalization error:', personalizationError);
    attachmentBuffer = baseDeclarationBuffer;
  }

  const { error } = await getResendClient().emails.send({
    from: 'the codeXverse™ <no-reply@thecodexverse.com>',
    to: email,
    subject: 'Something real just happened.',
    attachments: [
      {
        filename: "I Choose Me the Declaration.pdf",
        content: attachmentBuffer,
      },
    ],
    html: `
      <div style="background-color:#000000;padding:48px 32px;font-family:Georgia,serif;max-width:480px;margin:0 auto;">

        <p style="color:#d7ba7d;font-size:11px;letter-spacing:0.3em;margin:0 0 40px 0;">
          the codeXverse™
        </p>

        ${opening}

        ${framing}

        <p style="color:#d7ba7d;font-size:16px;font-style:italic;line-height:1.8;margin:0 0 40px 0;padding-left:16px;border-left:2px solid rgba(215,186,125,0.3);">
          "${q5NonNegotiable}"
        </p>

        ${question}

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">
          Your first inheritance from the codeXverse™ is attached.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          Move through it at the pace your nervous system asks for. Nothing here needs to be rushed.
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

  console.log("Resend raw response error:", error);
  console.log("Resend API key present:", !!process.env.RESEND_API_KEY);
  console.log("Sending to:", email);
  console.log("q5 value received:", q5NonNegotiable);

  if (error) {
    console.error('Resend email error:', error);
    return { ok: false, error };
  }

  return { ok: true };
}

// --- Email 2: Day 3 ---

export async function sendDayThreeEmail({
  email,
  q5NonNegotiable,
  q1Completed,
}: {
  email: string;
  q5NonNegotiable: string;
  q1Completed?: string;
}) {
  const personalLine = q1Completed && q1Completed.trim().length > 0
    ? `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You said you completed something: <em>${q1Completed}</em>. That is evidence. Not performance. Evidence that when you said you would, you did.</p>`
    : '';

  const { error } = await getResendClient().emails.send({
    from: 'the codeXverse™ <no-reply@thecodexverse.com>',
    to: email,
    subject: 'Three days ago, something shifted.',
    html: `
      <div style="background-color:#000000;padding:48px 32px;font-family:Georgia,serif;max-width:480px;margin:0 auto;">

        <p style="color:#d7ba7d;font-size:11px;letter-spacing:0.3em;margin:0 0 40px 0;">
          the codeXverse™
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          Three days ago you sat with something most people keep moving past.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          You named what is non-negotiable for you now.
        </p>

        <p style="color:#d7ba7d;font-size:16px;font-style:italic;line-height:1.8;margin:0 0 40px 0;padding-left:16px;border-left:2px solid rgba(215,186,125,0.3);">
          "${q5NonNegotiable}"
        </p>

        ${personalLine}

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          That word does not expire. It does not need to be re-earned.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          But it does need to be practiced. Not perfectly. Honestly.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">
          One question for the next three days:
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:18px;font-style:italic;line-height:1.9;margin:0 0 48px 0;">
          Where have you already honored it, even quietly, even imperfectly? That counts. Name it.
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

  if (error) {
    console.error('Resend day three email error:', error);
    return { ok: false, error };
  }

  return { ok: true };
}

// --- Email 3: Day 7 ---

export async function sendDaySevenEmail({
  email,
  q5NonNegotiable,
  q3Changed,
}: {
  email: string;
  q5NonNegotiable: string;
  q3Changed?: string;
}) {
  const personalLine = q3Changed && q3Changed.trim().length > 0
    ? `<p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">You said something changed: <em>${q3Changed}</em>. That is the Recognition Loop running. Something that was invisible became visible. That is the whole point.</p>`
    : '';

  const { error } = await getResendClient().emails.send({
    from: 'the codeXverse™ <no-reply@thecodexverse.com>',
    to: email,
    subject: 'A week ago, you did not look away.',
    html: `
      <div style="background-color:#000000;padding:48px 32px;font-family:Georgia,serif;max-width:480px;margin:0 auto;">

        <p style="color:#d7ba7d;font-size:11px;letter-spacing:0.3em;margin:0 0 40px 0;">
          the codeXverse™
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          A week ago you encountered something true about yourself.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          You are still carrying it. Even if it has been quiet. Even if life came back in and got loud again.
        </p>

        <p style="color:#d7ba7d;font-size:16px;font-style:italic;line-height:1.8;margin:0 0 40px 0;padding-left:16px;border-left:2px solid rgba(215,186,125,0.3);">
          "${q5NonNegotiable}"
        </p>

        ${personalLine}

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 24px 0;">
          That did not disappear. It became part of what you know.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 40px 0;">
          Once you see it, you cannot unsee it. That is not a warning. That is the promise.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 16px 0;">
          If something in you is ready to go deeper, the next door is waiting.
        </p>

        <p style="color:rgba(255,255,255,0.85);font-size:17px;font-weight:300;line-height:1.9;margin:0 0 48px 0;">
          Not because something essential was withheld here. Because recognition revealed there is more.
        </p>

        <a href="https://thecodexverse.com/door?from=day7&door=return_to_self&pathway=the_agreement" style="display:inline-block;color:#d7ba7d;font-size:13px;letter-spacing:0.2em;text-decoration:none;border:1px solid rgba(215,186,125,0.4);padding:12px 28px;">
          CONTINUE TO THE AGREEMENT
        </a>

        <p style="color:rgba(255,255,255,0.25);font-size:13px;line-height:1.8;margin:48px 0 8px 0;font-style:italic;">
          The door does not close. It waits.
        </p>

        <p style="color:rgba(255,255,255,0.15);font-size:11px;line-height:1.8;margin:48px 0 0 0;">
          This is not therapy. It is not a substitute for professional support.<br/>
          If you are in crisis, please reach out to a qualified professional.
        </p>

      </div>
    `,
  });

  if (error) {
    console.error('Resend day seven email error:', error);
    return { ok: false, error };
  }

  return { ok: true };
}