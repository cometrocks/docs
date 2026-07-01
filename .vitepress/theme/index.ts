import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import SupportForm from './components/SupportForm.vue'
import './custom.css'

// Comet-branded VitePress theme: extends the default theme with brand tokens
// (signature pink→cyan gradient, Bricolage Grotesque + JetBrains Mono) in custom.css.
// Registers <SupportForm /> globally so docs pages can embed the support ticket form.
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SupportForm', SupportForm)
  },
} satisfies Theme
