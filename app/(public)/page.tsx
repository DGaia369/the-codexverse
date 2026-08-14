import Link from 'next/link';
import Image from 'next/image';

// STRUCTURAL SCAFFOLD ONLY — Public Website Phase 0.
//
// No marketing copy has been written or approved for this page. Every
// bracketed [PLACEHOLDER] block below exists only to verify layout,
// spacing, and token usage, and must be replaced with Founder-approved
// copy in a separate governed pass before this page is considered
// participant-facing. Nothing here claims a brain-state mechanism, uses
// motion, autoplay, parallax, or urgency — per the Visual Nervous System
// requirement, this screen gives before it asks: it is deliberately inert.
export default function PublicHomePage() {
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
        <Image
          src="/Logo.png"
          alt="the codeXverse™"
          width={1536}
          height={1024}
          priority
          style={{ height: 'auto', width: '100%', maxWidth: '320px' }}
        />

        <div
          style={{
            border: '1px dashed rgba(215,186,125,0.35)',
            borderRadius: '12px',
            padding: '28px 24px',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(215,186,125,0.7)',
              margin: '0 0 12px',
            }}
          >
            Placeholder — pending Founder-approved copy
          </p>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'rgba(244,237,224,0.55)',
              margin: 0,
            }}
          >
            [Public homepage headline and introduction — not yet written.
            This block exists only to verify layout and spacing.]
          </p>
        </div>

        <Link
          href="/threshold"
          style={{
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'var(--cxv-public-gold-soft)',
            textDecoration: 'none',
            border: '1px solid rgba(215,186,125,0.4)',
            borderRadius: '999px',
            padding: '14px 32px',
          }}
        >
          ENTER
        </Link>
      </div>
    </main>
  );
}
