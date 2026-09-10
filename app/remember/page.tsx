import { redirect } from 'next/navigation';
import {
  checkRememberEligibility,
  getOrCreateActiveSession,
  getSessionResponses,
} from '@/utils/remember';
import { getRedirectForIneligibility } from '@/utils/remember';
import RememberExperience from './RememberExperience';

export default async function RememberPage() {
  const eligibility = await checkRememberEligibility();

  if (!eligibility.eligible) {
    redirect(getRedirectForIneligibility(eligibility));
  }

  const session = await getOrCreateActiveSession({
    userId: eligibility.userId,
    email: eligibility.email,
    pathwayOneSessionId: eligibility.pathwayOneSessionId,
  });

  const responsesResult = await getSessionResponses({
    userId: eligibility.userId,
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
