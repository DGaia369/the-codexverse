import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function RecordPage() {
  const cookieStore = await cookies();

  // Participant session client: used only to confirm who is signed in.
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server Components may read cookies but cannot modify them.
          // Cookie refresh remains the responsibility of Proxy/Middleware.
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError) {
    console.error('Recognition Record auth error:', userError);
  }

  if (!user?.email) {
    redirect('/begin');
  }

  const email = user.email.toLowerCase();

  // Server-only data client: avoids an RLS mismatch after identity is verified.
  // SUPABASE_SERVICE_ROLE_KEY must never be exposed through NEXT_PUBLIC_*.
  const dataClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: returnRow, error: returnError } = await dataClient
    .from('returns')
    .select('session_id, q1_completed, created_at')
    .eq('email', email)
    .not('q1_completed', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (returnError) {
    console.error('Recognition Record return lookup error:', returnError);
    throw new Error('Unable to load the participant Return record.');
  }

  if (!returnRow?.session_id) {
    const { data: activeRow, error: activeError } = await dataClient
      .from('returns')
      .select('session_id')
      .eq('email', email)
      .is('q1_completed', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeError) {
      console.error('Recognition Record active-session lookup error:', activeError);
      throw new Error('Unable to determine the active participant session.');
    }

    if (activeRow?.session_id) {
      redirect(
        `/pathway/return-to-self?session_id=${encodeURIComponent(
          activeRow.session_id
        )}`
      );
    }

    redirect('/return');
  }

  const { data: declaration, error: declarationError } = await dataClient
    .from('declarations')
    .select('status, sealed_at, session_id, email')
    .eq('session_id', returnRow.session_id)
    .maybeSingle();

  if (declarationError) {
    console.error('Recognition Record declaration lookup error:', declarationError);
    throw new Error('Unable to load the sealed Declaration record.');
  }

  if (!declaration || declaration.status !== 'sealed') {
    redirect(
      `/declaration?session_id=${encodeURIComponent(returnRow.session_id)}`
    );
  }

  const completedDate = declaration.sealed_at
    ? new Date(declaration.sealed_at).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#151310',
        color: '#F4EDE0',
      }}
    >
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '20px 40px',
          background:
            'linear-gradient(to bottom, rgba(21,19,16,0.98), rgba(21,19,16,0.82), transparent)',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            letterSpacing: '0.25em',
            color: '#D9B566',
            margin: 0,
          }}
        >
          the codeXverse™
        </p>
   
      </header>

      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '128px 40px 96px',
        }}
      >
        <div style={{ marginBottom: '64px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 300,
              letterSpacing: '0.02em',
              color: '#F4EDE0',
              margin: '0 0 12px',
              lineHeight: 1.3,
            }}
          >
            the Library of Yourself™
          </h1>
          <p
             style={{
             fontSize: '11px',
             letterSpacing: '0.2em',
             textTransform: 'uppercase',
             color: '#D9B566',
             margin: '0 0 20px',
            }}
          >
            Recognition Record™
          </p>
          <p
           style={{
           fontSize: '15px',
           color: '#B8ADA0',
           margin: '0 0 8px',
       }}
   >
            What became visible belongs to you.
          </p>
          
          <p
            style={{
              fontSize: '13px',
              color: '#82786D',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            Your First Inheritance™ is here. You may return to it whenever you
            need to remember what you already saw.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <RecordCard label="Pathway One™" title="Return to Self™">
            <RecordDetail>Status: Completed</RecordDetail>
            {completedDate && (
              <RecordDetail>Sealed: {completedDate}</RecordDetail>
            )}
          </RecordCard>

          <RecordCard
            label="Evidence"
            title="The Evidence You Carried Through"
          >
            <p
              style={{
                fontSize: '13px',
                color: '#82786D',
                margin: '0 0 24px',
                lineHeight: 1.7,
              }}
            >
              Your first words were evidence of what became visible when you
              crossed.
            </p>
            <RecordLink
              href={`/record/evidence?session_id=${encodeURIComponent(
                returnRow.session_id
              )}`}
            >
              View Evidence
            </RecordLink>
          </RecordCard>

          <RecordCard label="First Inheritance™" title="the Declaration™">
            <RecordDetail>Status: Sealed</RecordDetail>
            {completedDate && (
              <RecordDetail bottomMargin="24px">
                Sealed: {completedDate}
              </RecordDetail>
            )}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <RecordLink
                href={`/declaration?session_id=${encodeURIComponent(
                  returnRow.session_id
                )}&view=sealed`}
              >
                View Declaration™
              </RecordLink>

              <RecordLink
                href={`/api/declaration/pdf?session_id=${encodeURIComponent(
                  returnRow.session_id
                )}`}
                target="_blank"
              >
                Download PDF
              </RecordLink>
            </div>
          </RecordCard>

          <RecordCard
            label="Between Thresholds"
            title="The door between what ended and what has not yet begun."
          >
            <RecordLink
              href={`/between-threshold?session_id=${encodeURIComponent(
                returnRow.session_id
              )}`}
            >
              Return to Between Thresholds
            </RecordLink>
          </RecordCard>
        </div>
      </div>
    </main>
  );
}

function RecordCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: '1px solid rgba(217,181,102,0.22)',
        padding: '32px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#D9B566',
          margin: '0 0 8px',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 300,
          color: '#F4EDE0',
          margin: '0 0 16px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function RecordDetail({
  children,
  bottomMargin = '4px',
}: {
  children: React.ReactNode;
  bottomMargin?: string;
}) {
  return (
    <p
      style={{
        fontSize: '13px',
        color: '#82786D',
        margin: `0 0 ${bottomMargin}`,
      }}
    >
      {children}
    </p>
  );
}

function RecordLink({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: '_blank';
}) {
  return (
    <Link
      href={href}
      target={target}
      style={{
        fontSize: '13px',
        letterSpacing: '0.15em',
        color: '#D9B566',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}