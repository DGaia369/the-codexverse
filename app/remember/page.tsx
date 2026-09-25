import { redirect } from 'next/navigation';
import {
  getOrCreateActiveSession,
  getSessionResponses,
} from '@/utils/remember';
import { getRedirectForIneligibility } from '@/utils/remember';
import { authorizeRememberAccess } from '@/utils/authorization';
import RememberExperience from './RememberExperience';

export default async function RememberPage() {
  const authorization = await authorizeRememberAccess();

  if (!authorization.eligible) {
    redirect(getRedirectForIneligibility(authorization));
  }

  if (!authorization.entitled) {
    // Founder ruling, 2026-09-24 (Launch Sprint 1, Ruling 2): the public
    // Pathway Two™: ReMEMBER™ card is the durable destination for the
    // offer state. See docs/history/open-items.md item 21.
    redirect('/pathways#remember');
  }

  const session = await getOrCreateActiveSession({
    userId: authorization.userId,
    email: authorization.email,
    pathwayOneSessionId: authorization.pathwayOneSessionId,
  });

  const responsesResult = await getSessionResponses({
    userId: authorization.userId,
    rememberSessionId: session.id,
  });

  if (!responsesResult.ok) {
    throw new Error(responsesResult.error);
  }

  // Server-assigned, sticky for this session. Sessions created before the
  // Movement One v2.1 continuity migration carry an empty
  // variant_assignments object; roleCues defaults to an empty list in that
  // case rather than inventing an assignment client-side.
  const roleCues =
    'role_cues' in session.variant_assignments
      ? session.variant_assignments.role_cues
      : [];

  return (
    <RememberExperience
      initialScreenKey={session.current_screen_key}
      initialResponses={responsesResult.responses.map((r) => ({
        promptKey: r.prompt_key,
        responseText: r.response_text,
      }))}
      roleCues={roleCues}
    />
  );
}
