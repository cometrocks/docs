export const MIN_SUBMISSION_AGE_MS = 2_000
export const MAX_SUBMISSION_AGE_MS = 300_000

export type SupportTimingDecision = {
  canSubmit: boolean
  shouldResetTimer: boolean
  message: string | null
}

/**
 * Keeps the client in step with the contact endpoint's form-age limits.
 * The boundary values themselves are accepted by the endpoint.
 */
export function getSupportTimingDecision(
  elapsedMs: number,
): SupportTimingDecision {
  if (elapsedMs < MIN_SUBMISSION_AGE_MS) {
    return {
      canSubmit: false,
      shouldResetTimer: false,
      message: 'Please wait a moment before sending your request.',
    }
  }

  if (elapsedMs > MAX_SUBMISSION_AGE_MS) {
    return {
      canSubmit: false,
      shouldResetTimer: true,
      message:
        'This form session expired. Your draft is still here; please wait a moment, then try again.',
    }
  }

  return { canSubmit: true, shouldResetTimer: false, message: null }
}
