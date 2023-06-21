import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/reference/default-theme-config

export default defineConfig({
  title: 'Camunda Baker',
  description: 'Camunda non-official frontend CLI dedicated for building embedded forms',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/pedbernardo/cam-baker/edit/main/docs/:path'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide', activeMatch: '/guide' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide' },
          { text: 'CLI', link: '/guide/cli' },
          { text: 'Features', link: '/guide/features' },
          { text: 'Developing Forms', link: '/guide/forms' },
          { text: 'Camunda Integration', link: '/guide/camunda' },
          { text: 'Front-end Frameworks', link: '/guide/frameworks' },
          { text: 'Motivation', link: '/guide/motivation' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'General', link: '/guide/general' },
          { text: 'Shared', link: '/guide/shared' },
          { text: 'Watchers', link: '/guide/watchers' },
          { text: 'Env Variables', link: '/guide/env' },
          { text: 'Static Server', link: '/guide/server' },
          { text: 'Mock Server', link: '/guide/mock' },
          { text: 'Camunda Run', link: '/guide/run' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pedbernardo/cam-baker' }
    ]
  }
})
