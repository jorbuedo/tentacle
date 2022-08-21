import { createEffect, createResource } from 'solid-js'
import { model } from '~/view'
import { state } from '~/view/state'

const BalanceData = () => {
  const [data, { refetch }] = createResource(async () => {
    const balanceSummary = await model.getBalanceSummary()

    const balanceTotal = await model.getBalanceTotal()

    const balanceTransactions = await model.getBalanceTransactions()

    return {
      balanceSummary,
      balanceTotal,
      balanceTransactions,
    }
  })

  createEffect(() => {
    if (!state.isDataUpdating) {
      refetch()
    }
  })

  return data
}

export type BalanceDataType = typeof BalanceData

export default BalanceData
