import Link from 'next/link';

// Public-site navigation only. Do not import this into any immersive
// pathway route (Threshold, /begin, /pathway, /remember, /declaration,
// /record, etc.) — those build their own minimal per-page headers and must
// not inherit public marketing navigation. See app/(public)/layout.tsx for
// the only place this is wired in.
//
// All six destinations below now have a real page under app/(public)/
// (see Public Website Phase 1 restructuring) and are real links. Our
// Promise is a structural shell pending Founder-approved copy — that's a
// content-completeness state, not a routing one, so it links normally
// rather than being marked "soon." Lexicon is intentionally not in this
// nav (Phase 1A).
//
// Lowercase-article naming rule (Phase 1A): a canonical name beginning
// with "the" keeps the lowercase "t" even in navigation. "Recognition
// Archaeology™", "Our Promise", and "About" do not begin with "the" and
// are unaffected.

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'the Experience', href: '/experience' },
  { label: 'the Pathways', href: '/pathways' },
  { label: 'Recognition Archaeology™', href: '/recognition-archaeology' },
  { label: 'the Library of Yourself™', href: '/library-of-yourself' },
  { label: 'Our Promise', href: '/our-promise' },
  { label: 'About', href: '/about' },
];

const navLinkStyle: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '0.08em',
  color: 'rgba(244,237,224,0.7)',
  textDecoration: 'none',
};

export default function PublicHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'var(--cxv-public-charcoal)',
        borderBottom: '1px solid rgba(215,186,125,0.14)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: '13px',
            letterSpacing: '0.25em',
            color: 'var(--cxv-public-gold)',
            textDecoration: 'none',
          }}
        >
          the codeXverse™
        </Link>

        <nav
          aria-label="Public navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-70 transition-opacity"
              style={navLinkStyle}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/enter"
            style={{
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: 'rgba(244,237,224,0.7)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(215,186,125,0.25)',
              paddingBottom: '2px',
            }}
          >
            Return
          </Link>

          {/* Routes through the existing magic-link entry (/enter), not
              directly into /threshold — an unauthenticated visitor must
              pass through authentication before the immersive experience.
              See Phase 1A directive §2. */}
          <Link
            href="/enter"
            style={{
              fontSize: '12px',
              letterSpacing: '0.15em',
              color: 'var(--cxv-public-gold-soft)',
              textDecoration: 'none',
              border: '1px solid rgba(215,186,125,0.4)',
              borderRadius: '999px',
              padding: '8px 18px',
            }}
          >
            ENTER
          </Link>
        </nav>
      </div>
    </header>
  );
}
