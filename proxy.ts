import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const PROTECTED = [
  '/begin',
  '/return',
  '/pathway',
  '/door',
  '/foundation',
  '/guided',
  '/next-step',
  '/tier-2',
  '/return-complete',
];

// Session refresh and route protection are separate responsibilities
// (docs/history/open-items.md item 16). Server Components can read the
// Supabase session but cannot persist a refreshed cookie themselves — only
// Proxy and Route Handlers can. The three routes below are authenticated
// Server Component pages that sit outside PROTECTED on purpose: each owns
// its own participant-facing redirect logic for the unauthenticated case
// (checkRememberEligibility() for /remember; bespoke redirects in
// app/record/page.tsx and app/record/evidence/page.tsx), and that behavior
// must not change. They need Proxy to refresh their session cookies, but
// must never be redirected to /enter by Proxy the way PROTECTED routes are.
// See docs/architecture/session-management.md ("Session Refresh Mechanism").
const REFRESH_ONLY = ['/remember', '/record', '/record/evidence'];

// Exact match or a genuine subpath (i.e. requires the trailing slash),
// not a bare prefix — a plain startsWith() collided with unrelated
// routes that merely share a prefix (e.g. the public site's /pathways
// was being caught by '/pathway' and redirected to /enter). The
// existing separate '/return-complete' entry above already worked
// around this same class of collision with '/return'; this generalizes
// that fix to every entry instead of requiring one-off additions. Shared
// by PROTECTED and REFRESH_ONLY so both lists use identical matching
// semantics.
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = matchesRoute(pathname, PROTECTED);
  const isRefreshOnly = matchesRoute(pathname, REFRESH_ONLY);

  if (!isProtected && !isRefreshOnly) return NextResponse.next();

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only PROTECTED routes carry Proxy's redirect-if-unauthenticated
  // behavior. REFRESH_ONLY routes are refreshed above but always fall
  // through to `return response`, leaving their own page-owned redirect
  // logic as the sole authority on where an unauthenticated participant
  // goes.
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/enter', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)',
  ],
};