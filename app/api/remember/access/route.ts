import { NextResponse } from 'next/server';
import { authorizeRememberAccess } from '@/utils/authorization';

// GET /api/remember/access
//
// Launch Sprint 2. Polled by /remember/confirm while a verified payment is
// waiting for its webhook. Answers one boolean for the authenticated
// participant and nothing else: no reason, no ids, no payment data.
// Grants nothing.
export async function GET() {
  try {
    const authorization = await authorizeRememberAccess();
    return NextResponse.json(
      { authorized: authorization.authorized },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Access check failed:', (error as Error).message);
    return NextResponse.json(
      { authorized: false },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
