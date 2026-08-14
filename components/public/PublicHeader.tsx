import Link from 'next/link';

// Public-site navigation only. Do not import this into any immersive
// pathway route (Threshold, /begin, /pathway, /remember, /declaration,
// /record, etc.) — those build their own minimal per-page headers and must
// not inherit public marketing navigation. See app/(public)/layout.tsx for
// the only place this is wired in.
//
// The five interior links below (The Experience, Pathways, Recognition
// Archaeology™, the Library of Yourself™, Our Promise, About) have no
// destination page yet. They are structural placeholders only — marked
// visibly as "soon" and left unlinked (href="#") rather than pointed at a
// route that doesn't exist, so this scaffold never ships a dead link.
// Building those pages, and writing the copy for them, is a separate
// governed pass.

const PLACEHOLDER_LINKS = [
  'The Experience',
  'Pathways',
  'Recognition Archaeology™',
  'the Library of Yourself™',
  'Our Promise',
  'About',
];

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
          {PLACEHOLDER_LINKS.map((label) => (
            <span
              key={label}
              aria-disabled="true"
              title="Not yet built — placeholder"
              style={{
                fontSize: '12px',
                letterSpacing: '0.08em',
                color: 'rgba(244,237,224,0.35)',
                cursor: 'default',
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '6px',
              }}
            >
              {label}
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(215,186,125,0.4)' }}>
                soon
              </span>
            </span>
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

          <Link
            href="/threshold"
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
