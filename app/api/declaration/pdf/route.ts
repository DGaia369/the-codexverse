import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildPersonalizedDeclaration,
  DeclarationWritingInputs,
} from '@/utils/declarationBuilder';
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
//
// Loads the participant's five Return answers, and — only when the
// in-platform "I Choose Me" writing has been sealed — the 15 written
// fields as well. Builds the personalized PDF and returns it as a
// downloadable file.
//
// The sealed check happens here, server-side, regardless of what the
// UI shows or hides. A request for an unsealed Declaration is refused.
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
      .eq('session_id', session_id)
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

    // The sealed writing record is required before the artifact can be
    // downloaded or printed. This is not touched or overridden by the
    // client — it is checked fresh, here, every time.
    const { data: writingRecord, error: writingError } = await supabase
      .from('declarations')
      .select(
        `status,
         p1_q1, p1_q2,
         p2_q1, p2_q2, p2_q3,
         p3_q1, p3_q2,
         p4_q1, p4_q2, p4_q3,
         p5_q1, p5_q2, p5_q3, p5_q4, p5_q5`
      )
      .eq('session_id', session_id)
      .maybeSingle();

    if (writingError) {
      console.error('Declaration writing load error:', writingError);
      return NextResponse.json(
        { ok: false, error: 'Failed to load Declaration writing record' },
        { status: 500 }
      );
    }

    if (!writingRecord || writingRecord.status !== 'sealed') {
      return NextResponse.json(
        {
          ok: false,
          error:
            'This Declaration has not been sealed yet. Complete and seal it before downloading.',
        },
        { status: 403 }
      );
    }

    const writingInputs: DeclarationWritingInputs = {
      p1_q1: writingRecord.p1_q1,
      p1_q2: writingRecord.p1_q2,
      p2_q1: writingRecord.p2_q1,
      p2_q2: writingRecord.p2_q2,
      p2_q3: writingRecord.p2_q3,
      p3_q1: writingRecord.p3_q1,
      p3_q2: writingRecord.p3_q2,
      p4_q1: writingRecord.p4_q1,
      p4_q2: writingRecord.p4_q2,
      p4_q3: writingRecord.p4_q3,
      p5_q1: writingRecord.p5_q1,
      p5_q2: writingRecord.p5_q2,
      p5_q3: writingRecord.p5_q3,
      p5_q4: writingRecord.p5_q4,
      p5_q5: writingRecord.p5_q5,
    };

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
      },
      writingInputs
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