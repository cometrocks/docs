import { defineConfig } from 'vitepress'

const HOSTNAME = 'https://docs.comet.rocks'

export default defineConfig({
  title: 'Comet Rocks Docs',
  description: 'Headless ecommerce infrastructure for brands — developer documentation',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

  // Generates /sitemap.xml at build time for SEO + AI-engine pickup.
  sitemap: {
    hostname: HOSTNAME,
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    // Brand typography: Bricolage Grotesque (display) + JetBrains Mono (code)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=JetBrains+Mono:wght@400;500;700&display=swap',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Comet Rocks Developer Docs' }],
    ['meta', { property: 'og:description', content: 'Headless ecommerce infrastructure — GraphQL API reference, guides, and merchant integrations.' }],
    ['meta', { property: 'og:url', content: HOSTNAME }],
  ],

  themeConfig: {
    logo: { light: '/logo/light.svg', dark: '/logo/dark.svg', alt: 'Comet Rocks' },
    siteTitle: 'Comet Rocks Docs',

    nav: [
      { text: 'Publisher Docs', link: '/' },
      { text: 'Merchant Guides', link: '/merchant/shopify' },
      { text: 'Help Center', link: 'https://comet.rocks/help', target: '_blank' },
      { text: 'Dashboard', link: 'https://console.comet.rocks', target: '_blank' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Quick Start', link: '/quickstart' },
            { text: 'Tutorial: First Checkout Store', link: '/tutorial' },
          ],
        },
        {
          text: 'Publisher API',
          items: [
            { text: 'Apps', link: '/resources/apps' },
            { text: 'Authentication', link: '/resources/authentication/authentication' },
            {
              text: 'Catalog',
              collapsed: false,
              items: [
                { text: 'Search Products', link: '/resources/catalog/prod_search' },
                { text: 'Product by ID', link: '/resources/catalog/by_id' },
                { text: 'Product by SKU', link: '/resources/catalog/sku' },
              ],
            },
            {
              text: 'Checkout',
              collapsed: false,
              items: [
                { text: 'Carts & Bags', link: '/resources/checkout/carts' },
                { text: 'Create Cart', link: '/resources/checkout/cart_create' },
                { text: 'Add / Remove Products', link: '/resources/checkout/cart_add' },
                { text: 'Apply Discount', link: '/resources/checkout/cart_disc' },
                { text: 'Apply Addresses', link: '/resources/checkout/address' },
                { text: 'Shipping Methods', link: '/resources/checkout/shipping' },
                { text: 'Payment Intent', link: '/resources/checkout/payment' },
                { text: 'Submit Cart', link: '/resources/checkout/submit' },
                { text: 'Error Handling', link: '/resources/checkout/errors' },
              ],
            },
            { text: 'Pagination', link: '/resources/pagination' },
          ],
        },
      ],
      '/merchant/': [
        {
          text: 'Merchant Guides',
          items: [
            { text: 'Shopify', link: '/merchant/shopify' },
            { text: 'Magento 2', link: '/merchant/magento' },
            { text: 'Salesforce Commerce Cloud', link: '/merchant/salesforce' },
            { text: 'BigCommerce (planned)', link: '/merchant/bigcommerce' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cometrocks' },
      { icon: 'x', link: 'https://twitter.com/comet_rocks' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/cometrocks/' },
    ],

    editLink: {
      pattern: 'https://github.com/cometrocks/docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message:
        'Comet Rocks — Headless Ecommerce Infrastructure · <a href="https://comet.rocks">comet.rocks</a> · <a href="https://comet.rocks/help">Help Center</a>',
      copyright: 'Copyright © Comet Rocks',
    },

    search: {
      provider: 'local',
    },
  },
})
