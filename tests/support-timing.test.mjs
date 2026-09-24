import assert from 'node:assert/strict'
import test from 'node:test'

import {
  MAX_SUBMISSION_AGE_MS,
  MIN_SUBMISSION_AGE_MS,
  getSupportTimingDecision,
} from '../.vitepress/theme/supportTiming.ts'

test('requires a form to be open for at least two seconds', () => {
  assert.equal(
    getSupportTimingDecision(MIN_SUBMISSION_AGE_MS - 1).canSubmit,
    false,
  )
  assert.equal(
    getSupportTimingDecision(MIN_SUBMISSION_AGE_MS).canSubmit,
    true,
  )
})

test('accepts the five-minute boundary but expires older drafts', () => {
  assert.equal(
    getSupportTimingDecision(MAX_SUBMISSION_AGE_MS).canSubmit,
    true,
  )

  const expired = getSupportTimingDecision(MAX_SUBMISSION_AGE_MS + 1)
  assert.deepEqual(expired, {
    canSubmit: false,
    shouldResetTimer: true,
    message:
      'This form session expired. Your draft is still here; please wait a moment, then try again.',
  })
})
