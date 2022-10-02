import { createEffect, createResource } from 'solid-js'
import { model } from '~/view'
import { state } from '~/view/state'

const CapitalGainsData = () => {
  const [data, { refetch }] = createResource(async () => {
    const capitalGainsSummary = await model.getCapitalGainsSummary()

    const capitalGainsTotal = await model.getCapitalGainsTotal()

    const capitalGainsTransactions = await model.getCapitalGainsTransactions()

    return {
      capitalGainsSummary,
      capitalGainsTotal,
      capitalGainsTransactions,
    }
  })

  createEffect(() => {
    if (!state.isDataUpdating) {
      refetch()
    }
  })

  return data
}

export type CapitalGainsDataType = typeof CapitalGainsData

export default CapitalGainsData
