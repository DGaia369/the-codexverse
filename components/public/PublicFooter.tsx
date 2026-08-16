import Link from 'next/link';

// Public-site footer only. Do not import this into any immersive pathway
// route. See app/(public)/layout.tsx for the only place this is wired in.
//
// Legal routes now exist as structural shells (Phase 1A §10) — real
// links, but each page carries only the "pending Founder-approved copy"
// marker, not actual legal language. Do not add legal copy here or on
// those pages until it is supplied and reviewed separately.

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Access & Refund Policy', href: '/access-refund-policy' },
  { label: 'Library / Data & Portability', href: '/library-data-portability' },
  { label: 'Accessibility / Support', href: '/accessibility-support' },
];

export default function PublicFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--cxv-public-charcoal)',
        borderTop: '1px solid rgba(215,186,125,0.14)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'rgba(244,237,224,0.4)',
            margin: 0,
          }}
        >
          the codeXverse™
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-70 transition-opacity"
              style={{
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: 'rgba(244,237,224,0.4)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
