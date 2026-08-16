import { Heading, Body, Section } from '@/components/public/PublicProse';

// the Library of Yourself™ (public) — Founder-supplied copy, relocated
// here from Home v0.1 per the Phase 1 information-architecture
// correction. Reproduced exactly as supplied; not rewritten.
//
// This is the public explanation of the Library of Yourself™ concept
// only. It is architecturally distinct from the authenticated participant
// Library at app/record/page.tsx: this page renders no participant data,
// makes no Supabase call, requires no session, and does not link to
// /record. The two are kept structurally separate by simply never
// intersecting in code, not by an on-page disclaimer.
export default function LibraryOfYourselfPage() {
  return (
    <main>
      <Section first>
        <Heading level={1}>the Library of Yourself™</Heading>
        <Body>You are not here to reinvent yourself. You are here to recognize the self who was never gone.</Body>
        <Body>the Library of Yourself™ gives what became visible somewhere to remain.</Body>
        <Body>
          It is not a museum of the woman you used to be. It is evidence that the woman you kept looking for was never gone.
        </Body>
        <Body>Your words remain yours, your history does not disappear, and your place is remembered.</Body>
      </Section>
    </main>
  );
}
