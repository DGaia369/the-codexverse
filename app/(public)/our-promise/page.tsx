import { Heading, Body, Section, CREAM, GOLD } from '@/components/public/PublicProse';

// Our Promise — Founder-approved participant-facing copy, reproduced
// exactly as supplied (Public Website v1.0.1). Not rewritten, expanded,
// marketized, or summarized. Three lines carry deliberate typographic
// emphasis (opening, weighted, closing) as a single flowing passage —
// not cards, stacked slogans, or a visual ladder.
export default function OurPromisePage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>Our Promise</Heading>

        <p
          style={{
            fontStyle: 'italic',
            fontSize: '22px',
            fontWeight: 400,
            lineHeight: 1.6,
            color: CREAM,
            margin: '0 0 40px',
            maxWidth: '640px',
          }}
        >
          You will not come here to be told who you are.
        </p>

        <Body>
          the codeXverse™ creates conditions in which what has become
          difficult to see can become visible again. It does not place an
          identity inside you or decide what your experience means. What
          appears comes through the life you have lived and what you
          recognize when you meet it here.
        </Body>

        <Body>
          Technology may hold the thread, remember where you left off, and
          return what you have already made visible. It can support
          recognition.{' '}
          <span style={{ color: GOLD, fontStyle: 'italic' }}>
            It does not get authorship.
          </span>
        </Body>

        <Body>
          If something opens here, that openness will not be used as
          leverage. Nothing essential is withheld to manufacture desire for
          what comes next. Going deeper remains a choice, made because
          something you recognized gave you a reason to continue.
        </Body>

        <Body>
          the codeXverse™ is not here to make your return to yourself
          dependent upon us. If you ever have to trust our interpretation
          more than your own recognition in order to belong here, we have
          failed our purpose.
        </Body>

        <Body>What becomes visible belongs to you.</Body>

        <p
          style={{
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: 1.5,
            color: CREAM,
            margin: '16px 0 0',
            maxWidth: '640px',
          }}
        >
          You remain the authority on you.
        </p>
      </Section>
    </main>
  );
}
