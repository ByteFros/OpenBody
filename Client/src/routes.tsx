import { createBrowserRouter } from 'react-router'

import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary'
import { RootLayout } from '@/layouts/RootLayout'
import { ExplorerPage } from '@/pages/ExplorerPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrganPage } from '@/pages/OrganPage'
import { OrgansPage } from '@/pages/OrgansPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: HomePage },
      { path: 'explorer', Component: ExplorerPage },
      { path: 'organs', Component: OrgansPage },
      { path: 'organs/:slug', Component: OrganPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
