import type { Metadata } from 'next';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

// Social/share metadata for the public site only. Scoped to this segment
// (not the root layout) so it does not affect immersive pathway routes,
// which sit outside the (public) route group and keep the root layout's
// metadata. No Open Graph image is set here: no Founder-approved share
// asset could be positively identified in the repository as of Public
// Website v1.0.1 — see release continuity notes. Do not substitute an
// unapproved image.
export const metadata: Metadata = {
  title: 'the codeXverse™ | Reclaim. Rebuild. Reveal.',
  description:
    'A Recognition Ecosystem™ for women at the crossroads. Recognition before transformation.',
  openGraph: {
    title: 'the codeXverse™ | Reclaim. Rebuild. Reveal.',
    description:
      'A Recognition Ecosystem™ for women at the crossroads. Recognition before transformation.',
  },
};

// This layout applies ONLY to routes inside the (public) route group.
// Route groups do not affect the URL — `(public)` is not part of the
// path. Immersive routes (app/threshold, app/begin, app/pathway,
// app/remember, app/declaration, app/record, etc.) sit outside this group
// and are wrapped only by the root app/layout.tsx, so they never receive
// this header/footer, and never inherit this background fix — it is
// scoped to this wrapper only.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // 100% against <body> does not reliably resolve here — body has
        // min-height (via Tailwind's min-h-full) but no explicit height,
        // so a percentage-height child can collapse to content height,
        // leaving default (white) page background visible below the
        // footer on short pages. 100dvh is viewport-relative and resolves
        // independent of the ancestor chain, and accounts for mobile
        // browser chrome (address bar) better than 100vh.
        minHeight: '100dvh',
        backgroundColor: 'var(--cxv-public-charcoal)',
        color: 'var(--cxv-public-cream)',
      }}
    >
      <PublicHeader />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
