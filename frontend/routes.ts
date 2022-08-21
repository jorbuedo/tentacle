import { lazy } from 'solid-js'
import { RouteDefinition } from '@solidjs/router'

import BalanceData from './pages/balance.data'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/balance')),
    data: BalanceData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
]
