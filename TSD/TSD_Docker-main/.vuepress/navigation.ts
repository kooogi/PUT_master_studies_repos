import type { NavbarConfig, SidebarConfig } from '@vuepress/theme-default'

export const navbar: NavbarConfig = [
  '/cheetsheet.md',
  '/presentation.md',
  {
    text: 'Repository',
    link: 'https://github.com/drmikeman/tsd-docker-workshop',
  },
]

export const sidebar: SidebarConfig = [
  '/intro.md',
  '/first-steps.md',
  '/next-steps.md',
]
