import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

// Comet-branded VitePress theme: extends the default theme with brand tokens
// (signature pink→cyan gradient, Bricolage Grotesque + JetBrains Mono) in custom.css.
export default {
  extends: DefaultTheme,
} satisfies Theme
