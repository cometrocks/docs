<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

/**
 * Support request form embedded in the developer docs.
 *
 * Submits cross-origin to the marketing site's contact endpoint
 * (`/api/contact` with `type: 'support'`), which emails the support inbox and
 * confirms to the requester. The endpoint allows CORS from *.comet.rocks.
 */
const ENDPOINT =
  (import.meta.env?.VITE_SUPPORT_ENDPOINT as string | undefined) ||
  'https://comet.rocks/api/contact'

const categories = [
  { value: 'technical', label: 'Technical / integration' },
  { value: 'general', label: 'General question' },
  { value: 'billing', label: 'Billing & plans' },
  { value: 'account', label: 'Account & access' },
  { value: 'bug', label: 'Bug report' },
  { value: 'feature', label: 'Feature request' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({
  name: '',
  email: '',
  category: 'technical',
  subject: '',
  message: '',
})

const honeypot = ref('')
const mountedAt = ref(0)
const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)
const isSuccess = ref(false)
const serverError = ref('')

onMounted(() => {
  mountedAt.value = Date.now()
})

function validate(): boolean {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_REGEX.test(form.email.trim()))
    errors.email = 'Enter a valid email address.'
  if (!form.subject.trim()) errors.subject = 'Add a short subject.'
  if (!form.message.trim()) errors.message = 'Describe your request.'
  else if (form.message.trim().length < 10)
    errors.message = 'Add a little more detail (10+ characters).'
  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) return
  isLoading.value = true
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'support',
        firstName: form.name.trim(),
        email: form.email.trim(),
        category: form.category,
        subject: form.subject.trim(),
        message: form.message.trim(),
        _source: 'docs',
        _hp: honeypot.value,
        _t: String(Date.now() - mountedAt.value),
      }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      throw new Error(data.message || 'Something went wrong. Please try again.')
    }
    isSuccess.value = true
  } catch (err) {
    serverError.value =
      err instanceof Error ? err.message : 'Something went wrong.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="sf-wrap">
    <div v-if="isSuccess" class="sf-done">
      <strong>Request received.</strong>
      <p>
        Thanks — we’ve emailed you a confirmation and the team will reply within
        one business day.
      </p>
    </div>

    <form v-else class="sf-form" novalidate @submit.prevent="submit">
      <input
        v-model="honeypot"
        class="sf-hp"
        type="text"
        name="company_url"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />

      <div class="sf-row">
        <label class="sf-field">
          <span>Your name</span>
          <input v-model="form.name" type="text" placeholder="Jane Doe" />
        </label>
        <label class="sf-field">
          <span>Email <i>*</i></span>
          <input
            v-model="form.email"
            type="email"
            placeholder="jane@company.com"
            :class="{ 'sf-err-input': errors.email }"
          />
          <em v-if="errors.email" class="sf-err">{{ errors.email }}</em>
        </label>
      </div>

      <div class="sf-row">
        <label class="sf-field">
          <span>Topic</span>
          <select v-model="form.category">
            <option v-for="c in categories" :key="c.value" :value="c.value">
              {{ c.label }}
            </option>
          </select>
        </label>
        <label class="sf-field">
          <span>Subject <i>*</i></span>
          <input
            v-model="form.subject"
            type="text"
            placeholder="Short summary"
            :class="{ 'sf-err-input': errors.subject }"
          />
          <em v-if="errors.subject" class="sf-err">{{ errors.subject }}</em>
        </label>
      </div>

      <label class="sf-field">
        <span>How can we help? <i>*</i></span>
        <textarea
          v-model="form.message"
          rows="6"
          placeholder="Include the API call or integration step, what you expected, and any error responses (with request IDs if you have them)."
          :class="{ 'sf-err-input': errors.message }"
        />
        <em v-if="errors.message" class="sf-err">{{ errors.message }}</em>
      </label>

      <p v-if="serverError" class="sf-server-err">{{ serverError }}</p>

      <div class="sf-actions">
        <button type="submit" class="sf-submit" :disabled="isLoading">
          {{ isLoading ? 'Sending…' : 'Send request' }}
        </button>
        <span class="sf-alt">
          Prefer email?
          <a href="mailto:support@comet.rocks">support@comet.rocks</a>
        </span>
      </div>
    </form>
  </div>
</template>

<style scoped>
.sf-wrap {
  margin: 24px 0;
}
.sf-form {
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}
.sf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) {
  .sf-row {
    grid-template-columns: 1fr;
  }
}
.sf-field {
  display: grid;
  gap: 6px;
  font-size: 14px;
}
.sf-field > span {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sf-field i {
  color: var(--vp-c-brand-1);
  font-style: normal;
}
.sf-field input,
.sf-field select,
.sf-field textarea {
  width: 100%;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  transition: border-color 0.15s;
}
.sf-field textarea {
  resize: vertical;
  line-height: 1.6;
}
.sf-field input:focus,
.sf-field select:focus,
.sf-field textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.sf-err-input {
  border-color: #e5484d !important;
}
.sf-err {
  font-style: normal;
  font-size: 12.5px;
  color: #e5484d;
}
.sf-server-err {
  margin: 0;
  font-size: 13.5px;
  color: #e5484d;
}
.sf-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.sf-submit {
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: var(--vp-c-brand-3);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.sf-submit:hover {
  background: var(--vp-button-brand-hover-bg);
}
.sf-submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.sf-alt {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.sf-done {
  padding: 20px 24px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 14px;
  background: var(--vp-c-brand-soft);
}
.sf-done p {
  margin: 6px 0 0;
}
.sf-hp {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
