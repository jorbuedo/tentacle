import { lazy } from 'solid-js'
import { RouteDefinition, useNavigate } from '@solidjs/router'
import { state } from '~/view/state'

import BalanceData from './pages/balance.data'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    element: null,
    data: () => {
      const navigate = useNavigate()
      if (state.hasApiKey) {
        navigate('/balance', { replace: true })
      } else {
        navigate('/accounts', { replace: true })
      }
    },
  },
  {
    path: '/balance',
    component: lazy(() => import('./pages/balance')),
    data: BalanceData,
  },
  {
    path: '/accounts',
    component: lazy(() => import('./pages/accounts')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
]
