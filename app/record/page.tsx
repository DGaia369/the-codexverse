import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import Link from 'next/link';

export default async function RecordPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (_e) {
            // Server Component cannot set cookies.
            // Session reading still works correctly.
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect('/begin');
  }

  const email = user.email.toLowerCase();

  const { data: returnRow } = await supabase
    .from('returns')
    .select('session_id, q1_completed, created_at')
    .eq('email', email)
    .not('q1_completed', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!returnRow?.session_id) {
    const { data: activeRow } = await supabase
      .from('returns')
      .select('session_id')
      .eq('email', email)
      .is('q1_completed', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeRow?.session_id) {
      redirect(`/pathway/return-to-self?session_id=${encodeURIComponent(activeRow.session_id)}`);
    }

    redirect('/return');
  }

  const { data: declaration } = await supabase
    .from('declarations')
    .select('status, sealed_at, session_id')
    .eq('email', email)
    .eq('session_id', returnRow.session_id)
    .maybeSingle();

  if (!declaration || declaration.status !== 'sealed') {
    redirect(`/declaration?session_id=${encodeURIComponent(returnRow.session_id)}`);
  }

  const completedDate = declaration.sealed_at
    ? new Date(declaration.sealed_at).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#F4EDE0' }}>

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '20px 40px',
      }}>
        <p style={{
          fontSize: '13px',
          letterSpacing: '0.25em',
          color: '#d7ba7d',
          margin: 0,
        }}>
          the codeXverse™
        </p>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.55)',
          margin: '2px 0 0',
        }}>
          Recognition Record™
        </p>
      </header>

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '128px 40px 96px',
      }}>

        <div style={{ marginBottom: '64px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: '#F4EDE0',
            margin: '0 0 16px',
            lineHeight: 1.3,
          }}>
            the Recognition Record™
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            margin: '0 0 8px',
          }}>
            What became visible belongs to you.
          </p>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
            lineHeight: 1.7,
          }}>
            Your First Inheritance™ is here. You may return to it
            whenever you need to remember what you already saw.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px',
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d7ba7d',
              margin: '0 0 8px',
            }}>
              Pathway One™
            </p>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#F4EDE0',
              margin: '0 0 16px',
            }}>
              Return to Self™
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>
              Status: Completed
            </p>
            {completedDate && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Sealed: {completedDate}
              </p>
            )}
          </div>

          <div style={{
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px',
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d7ba7d',
              margin: '0 0 8px',
            }}>
              Evidence
            </p>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#F4EDE0',
              margin: '0 0 12px',
            }}>
              The Evidence You Carried Through
            </h2>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              margin: '0 0 24px',
              lineHeight: 1.7,
            }}>
              Your first words were not a draft. They were evidence
              of what became visible when you crossed.
            </p>
            <Link
              href={`/record/evidence?session_id=${encodeURIComponent(returnRow.session_id)}`}
              style={{
                fontSize: '13px',
                letterSpacing: '0.15em',
                color: '#d7ba7d',
                textDecoration: 'none',
              }}
            >
              View Evidence
            </Link>
          </div>

          <div style={{
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px',
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d7ba7d',
              margin: '0 0 8px',
            }}>
              First Inheritance™
            </p>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#F4EDE0',
              margin: '0 0 12px',
            }}>
              the Declaration™
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>
              Status: Sealed
            </p>
            {completedDate && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
                Sealed: {completedDate}
              </p>
            )}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Link
                href={`/declaration?session_id=${encodeURIComponent(returnRow.session_id)}&view=sealed`}
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  color: '#d7ba7d',
                  textDecoration: 'none',
                }}
              >
                View Declaration™
              </Link>
              <Link
                href={`/api/declaration/pdf?session_id=${encodeURIComponent(returnRow.session_id)}`}
                target="_blank"
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  color: '#d7ba7d',
                  textDecoration: 'none',
                }}
              >
                Download PDF
              </Link>
            </div>
          </div>

          <div style={{
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px',
          }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d7ba7d',
              margin: '0 0 8px',
            }}>
              Between Thresholds
            </p>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#F4EDE0',
              margin: '0 0 12px',
            }}>
              The door between what ended and what has not yet begun.
            </h2>
            <Link
              href="/between-threshold"
              style={{
                fontSize: '13px',
                letterSpacing: '0.15em',
                color: '#d7ba7d',
                textDecoration: 'none',
              }}
            >
              Return to Between-Threshold
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}