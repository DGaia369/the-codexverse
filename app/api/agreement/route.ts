import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  pickRandom,
  noticingVariants,
  recognitionVariants,
  completionVariants,
} from '@/utils/agreementVariants';

// Lazy initialization. Do not construct at module top level, or
// Vercel's build-time page data collection will throw if env vars
// are not present in that build worker context (same pattern as the
// Resend client and the /guided Supabase client fixed earlier).
let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

// GET /api/agreement?session_id=xxx
// Loads an existing record by session_id. Returns null record if none
// exists yet (page will then call POST to create one).
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('pathway_two_agreements')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('Agreement GET error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to load Agreement record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, record: data ?? null });
  } catch (err) {
    console.error('Agreement GET unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error loading Agreement record' },
      { status: 500 }
    );
  }
}

// POST /api/agreement
// Creates a new Agreement record if one does not already exist for
// this session_id. Picks and persists randomized variants ONCE.
// If a record already exists, returns it unchanged (no re-randomization).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, email, source, door, pathway } = body;

    if (!session_id) {
      return NextResponse.json(
        { ok: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Check for an existing record first. Randomize once, persist
    // immediately, return consistently.
    const { data: existing, error: lookupError } = await supabase
      .from('pathway_two_agreements')
      .select('*')
      .eq('session_id', session_id)
      .maybeSingle();

    if (lookupError) {
      console.error('Agreement lookup error:', lookupError);
      return NextResponse.json(
        { ok: false, error: 'Failed to check for existing Agreement record' },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({ ok: true, record: existing, created: false });
    }

    const noticingVariant = pickRandom(noticingVariants).key;
    const recognitionVariant = pickRandom(recognitionVariants).key;
    const completionVariant = pickRandom(completionVariants).key;

    const { data: created, error: insertError } = await supabase
      .from('pathway_two_agreements')
      .insert({
        email: email ?? null,
        session_id,
        source: source ?? null,
        door: door ?? null,
        pathway: pathway ?? null,
        noticing_variant: noticingVariant,
        recognition_variant: recognitionVariant,
        completion_variant: completionVariant,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Agreement insert error:', insertError);
      return NextResponse.json(
        { ok: false, error: 'Failed to create Agreement record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, record: created, created: true });
  } catch (err) {
    console.error('Agreement POST unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error creating Agreement record' },
      { status: 500 }
    );
  }
}

// PATCH /api/agreement
// Saves the two Agreement answers, and/or marks completion.
// Body: { session_id, no_longer_in_agreement_with?, chosen_agreement?, complete? }
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      session_id,
      no_longer_in_agreement_with,
      chosen_agreement,
      complete,
    } = body;

    if (!session_id) {
      return NextResponse.json(
        { ok: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof no_longer_in_agreement_with === 'string') {
      updates.no_longer_in_agreement_with = no_longer_in_agreement_with;
    }

    if (typeof chosen_agreement === 'string') {
      updates.chosen_agreement = chosen_agreement;
    }

    if (complete === true) {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('pathway_two_agreements')
      .update(updates)
      .eq('session_id', session_id)
      .select()
      .single();

    if (error) {
      console.error('Agreement PATCH error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to save Agreement record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, record: data });
  } catch (err) {
    console.error('Agreement PATCH unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error saving Agreement record' },
      { status: 500 }
    );
  }
}