import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

// This layout applies ONLY to routes inside the (public) route group
// (currently just `/`, via app/(public)/page.tsx). Route groups do not
// affect the URL — `(public)` is not part of the path. Immersive routes
// (app/threshold, app/begin, app/pathway, app/remember, app/declaration,
// app/record, etc.) sit outside this group and are wrapped only by the
// root app/layout.tsx, so they never receive this header/footer.
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
        minHeight: '100%',
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
