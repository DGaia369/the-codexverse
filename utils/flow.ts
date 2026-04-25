export function classifyResponse(input: {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  door: string;
  pathway: string;
}) {
  const combined = [
    input.q1,
    input.q2,
    input.q3,
    input.q4,
    input.q5,
  ]
    .join(" ")
    .toLowerCase();

  if (
    combined.includes("clarity") ||
    combined.includes("clear") ||
    combined.includes("aware") ||
    combined.includes("awareness")
  ) {
    return "needs_clarity";
  }

  if (
    combined.includes("support") ||
    combined.includes("overwhelmed") ||
    combined.includes("scared") ||
    combined.includes("hesitant")
  ) {
    return "needs_support";
  }

  if (
    combined.includes("ready") ||
    combined.includes("commit") ||
    combined.includes("committed") ||
    combined.includes("decide") ||
    combined.includes("action")
  ) {
    return "ready_for_next_step";
  }

  return "general";
}

export function determineDoor(response_category: string) {
  if (response_category === "needs_support") {
    return "stuck";
  }

  if (response_category === "needs_clarity") {
    return "rebuilding";
  }

  if (response_category === "ready_for_next_step") {
    return "inconsistent";
  }

  return "lost";
}

export function buildNextInstruction({
  door,
  pathway,
  response_category,
}: {
  door: string;
  pathway: string;
  response_category: string;
}) {
  if (pathway === "guided-support") {
    return "Stay with what you uncovered today.\n\nYou do not have to force your way forward. We will guide you through rebuilding — step by step.";
  }

  if (pathway === "self-directed") {
    if (response_category === "needs_clarity") {
 if (response_category === "needs_clarity") {
  return "You don’t need more information.\nYou need to decide what matters now and move on it.\n\nChoose one clear action today and complete it.";
}
    }

    return "You already have traction.\n\nStay consistent with what you started. Execution now matters more than reflection.";
  }

  return "Stay with your return.\n\nThe next step will reveal itself through action.";
}

export function determineAction(response_category: string) {
  if (response_category === "needs_clarity") {
    return "send_clarity_email";
  }

  if (response_category === "ready_for_next_step") {
    return "send_next_step_offer";
  }

  if (response_category === "needs_support") {
    return "send_support_message";
  }

  return "manual_review";
}