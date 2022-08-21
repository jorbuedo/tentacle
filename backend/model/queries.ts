import { getAll } from './database'
import getIncomeSummaryQuery from '../sql/getIncomeSummary.sql?raw'
import getIncomeTotalQuery from '../sql/getIncomeTotal.sql?raw'
import getIncomeTransactionsQuery from '../sql/getIncomeTransactions.sql?raw'
import getBalanceSummaryQuery from '../sql/getBalanceSummary.sql?raw'
import getBalanceTotalQuery from '../sql/getBalanceTotal.sql?raw'
import getBalanceTransactionsQuery from '../sql/getBalanceTransactions.sql?raw'
import getCapitalGainsSummaryQuery from '../sql/getCapitalGainsSummary.sql?raw'
import getCapitalGainsTotalQuery from '../sql/getCapitalGainsTotal.sql?raw'
import getCapitalGainsTransactionsQuery from '../sql/getCapitalGainsTransactions.sql?raw'

const curryQuery =
  <T>(sql: string) =>
  async (params?: any) =>
    await getAll<T>(sql, params)

type IncomeSummaryType = {
  asset: string
  amount: number
  current_value: number
}

export const getIncomeSummary = curryQuery<IncomeSummaryType>(
  getIncomeSummaryQuery
)

type IncomeTotalType = {
  total_current_value: number
}

export const getIncomeTotal = curryQuery<IncomeTotalType>(getIncomeTotalQuery)

type IncomeTransactionType = {
  asset: string
  time: number
  amount: number
  historic_value: number
  current_value: number
}

export const getIncomeTransactions = curryQuery<IncomeTransactionType>(
  getIncomeTransactionsQuery
)

type BalanceSummaryType = {
  asset: string
  amount: number
  avg_price: number
  current_price: number
  invested_value: number
  current_value: number
  gainloss_value: number
  gainloss_percent: number
}

export const getBalanceSummary = curryQuery<BalanceSummaryType>(
  getBalanceSummaryQuery
)

type BalanceTotalType = {
  total_current_value: number
}

export const getBalanceTotal =
  curryQuery<BalanceTotalType>(getBalanceTotalQuery)

type BalanceTransactionType = {
  asset: string
  time: number
  amount: number
  price: number
  current_price: number
  value: number
  current_value: number
}
export const getBalanceTransactions = curryQuery<BalanceTransactionType>(
  getBalanceTransactionsQuery
)

type CapitalGainsSummaryType = {
  asset: string
  amount: number
  avg_buy_price: number
  avg_sell_price: number
  gainloss: number
}

export const getCapitalGainsSummary = curryQuery<CapitalGainsSummaryType>(
  getCapitalGainsSummaryQuery
)

type CapitalGainsTotalType = {
  total_gainloss: number
}

export const getCapitalGainsTotal = curryQuery<CapitalGainsTotalType>(
  getCapitalGainsTotalQuery
)

type CapitalGainsTransactionType = {
  asset: string
  amount: number
  buy_time: number
  sell_time: number
  holding_period: number
  buy_price: number
  sell_price: number
  gainloss: number
}

export const getCapitalGainsTransactions =
  curryQuery<CapitalGainsTransactionType>(getCapitalGainsTransactionsQuery)
