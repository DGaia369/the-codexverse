// Public-site footer only. Do not import this into any immersive pathway
// route. See app/(public)/layout.tsx for the only place this is wired in.
//
// Legal links (Terms, Privacy, etc.) do not exist yet — see the Public
// Website Inventory report, §9. Left as marked, unlinked placeholders
// rather than routed to pages that don't exist, and no legal copy is
// invented here.

const LEGAL_PLACEHOLDERS = ['Terms', 'Privacy', 'Access Policy'];

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
          padding: '32px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
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

        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          {LEGAL_PLACEHOLDERS.map((label) => (
            <span
              key={label}
              aria-disabled="true"
              title="Not yet published — placeholder"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'rgba(244,237,224,0.28)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
