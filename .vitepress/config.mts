import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Comet Rocks',
  description: 'Headless ecommerce infrastructure for brands — developer documentation',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],

  themeConfig: {
    logo: '/logo/dark.svg',
    siteTitle: 'Comet Rocks Docs',

    nav: [
      { text: 'Publisher Docs', link: '/' },
      { text: 'Merchant Guides', link: '/merchant/shopify' },
      { text: 'Dashboard', link: 'https://console.comet.rocks', target: '_blank' },
      { text: 'Support', link: 'mailto:support@comet.rocks' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Quick Start', link: '/quickstart' },
            { text: 'Tutorial: First Campaign Storefront', link: '/tutorial' },
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
            { text: 'BigCommerce', link: '/merchant/bigcommerce' },
            { text: 'Salesforce Commerce Cloud', link: '/merchant/salesforce' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cometrocks' },
      { icon: 'twitter', link: 'https://twitter.com/comet_rocks' },
    ],

    footer: {
      message: 'Comet Rocks — Headless Ecommerce Infrastructure',
      copyright: 'Copyright © Comet Rocks',
    },

    search: {
      provider: 'local',
    },
  },
})
