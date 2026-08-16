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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exact match or a genuine subpath (i.e. requires the trailing slash),
  // not a bare prefix — a plain startsWith() collided with unrelated
  // routes that merely share a prefix (e.g. the public site's /pathways
  // was being caught by '/pathway' and redirected to /enter). The
  // existing separate '/return-complete' entry above already worked
  // around this same class of collision with '/return'; this generalizes
  // that fix to every entry instead of requiring one-off additions.
  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

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

  if (!user) {
    return NextResponse.redirect(new URL('/enter', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)',
  ],
};