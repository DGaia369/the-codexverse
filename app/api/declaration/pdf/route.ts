import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { buildPersonalizedDeclaration } from '@/utils/declarationBuilder';
import fs from 'fs';
import path from 'path';

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

// POST /api/declaration/pdf
// Body: { session_id }
// Loads the participant's five answers, builds the personalized PDF,
// and returns it as a downloadable file.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { ok: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('returns')
      .select(
        'q1_completed, q2_resistance, q3_changed, q4_truth_revealed, q5_non_negotiable'
      )
      .eq('session_id', sessionId!)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Declaration PDF load error:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to load participant record' },
        { status: 500 }
      );
    }

    const pdfPath = path.join(process.cwd(), 'public', 'declaration.pdf');
    const basePdfBuffer = fs.readFileSync(pdfPath);

    const personalizedBuffer = await buildPersonalizedDeclaration(
      basePdfBuffer,
      {
        q1Completed: data.q1_completed,
        q2Resistance: data.q2_resistance,
        q3Changed: data.q3_changed,
        q4TruthRevealed: data.q4_truth_revealed,
        q5NonNegotiable: data.q5_non_negotiable,
      }
    );

    return new NextResponse(new Uint8Array(personalizedBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="the-declaration.pdf"',
      },
    });
  } catch (err) {
    console.error('Declaration PDF unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unexpected error building Declaration PDF' },
      { status: 500 }
    );
  }
}