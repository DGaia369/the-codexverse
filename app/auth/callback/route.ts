import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check participant's existing progress and route accordingly.
      // Safety first: if anything fails, fall through to /return.
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user?.email) {
          const { data: returnRow } = await supabase
            .from('returns')
            .select('session_id, q1_completed, door, pathway')
            .eq('email', user.email.toLowerCase())
            .not('q1_completed', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (returnRow?.session_id) {
            // Participant has a completed return — send to their Declaration.
            return NextResponse.redirect(
              `${origin}/declaration?session_id=${encodeURIComponent(returnRow.session_id)}`
            );
          }

          // Check for an active session with no answers yet.
          const { data: activeRow } = await supabase
            .from('returns')
            .select('session_id')
            .eq('email', user.email.toLowerCase())
            .is('q1_completed', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (activeRow?.session_id) {
            // Participant started but has not yet submitted answers.
            return NextResponse.redirect(
              `${origin}/pathway/return-to-self?session_id=${encodeURIComponent(activeRow.session_id)}`
            );
          }
        }
      } catch (routingError) {
        console.error('Auth callback routing error:', routingError);
        // Fall through to default /return redirect below.
      }

      // First-time participant or routing lookup found nothing.
      return NextResponse.redirect(`${origin}/return`);
    }
  }

  return NextResponse.redirect(`${origin}/enter?error=link_expired`);
}