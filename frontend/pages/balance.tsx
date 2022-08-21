import { useRouteData } from '@solidjs/router'
import { For, Suspense } from 'solid-js'
import Asset from '~/components/Asset'
import FormattedNumber from '~/components/FormattedNumber'
import FormattedTime from '~/components/FormattedTime'
import { BalanceDataType } from './balance.data'

export default function Balance() {
  const data = useRouteData<BalanceDataType>()

  return (
    <Suspense fallback="Loading...">
      <section class="bg-grey-200 dark:text-grey-200 flex place-content-center p-4">
        <article class="flex flex-col text-center">
          <FormattedNumber
            class="text-xl font-bold"
            value={data()?.balanceTotal[0]?.total_current_value}
            options={{
              style: 'currency',
              currency: 'EUR',
            }}
          />
          <span class="text-xs">Current valuation</span>
        </article>
      </section>
      <section class="bg-grey-100 max-w-full overflow-auto p-2">
        <table class="custom-table">
          <thead>
            <tr>
              <For
                each={[
                  'asset',
                  'amount',
                  'avg. price',
                  'cur. price',
                  'invested',
                  'value',
                  'gains',
                  'gains %',
                ]}
              >
                {(name, i) => <th data-index={i()}>{name}</th>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={data()?.balanceSummary}>
              {(row, i) => (
                <tr data-index={i()}>
                  <td>
                    <Asset name={row.asset} class="w-24" />
                  </td>
                  <td>
                    <FormattedNumber value={row.amount} />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.avg_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.current_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.invested_value}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.current_value}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.gainloss_value}
                      isColored
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                        // 'exceptZero' is missing on current ts version
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        signDisplay: 'exceptZero',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.gainloss_percent / 100}
                      isColored
                      options={{
                        style: 'percent',
                        // 'exceptZero' is missing on current ts version
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        signDisplay: 'exceptZero',
                      }}
                    />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </section>
      <section class="bg-grey-50 max-w-full overflow-auto p-2">
        <table class="custom-table">
          <thead>
            <tr>
              <For
                each={[
                  'asset',
                  'amount',
                  'time',
                  'buy price',
                  'cur. price',
                  'value',
                  'cur. value',
                ]}
              >
                {(name, i) => <th data-index={i()}>{name}</th>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={data()?.balanceTransactions}>
              {(row, i) => (
                <tr data-index={i()}>
                  <td>
                    <Asset name={row.asset} class="w-24" />
                  </td>
                  <td>
                    <FormattedNumber value={row.amount} />
                  </td>
                  <td>
                    <FormattedTime class="grow text-right" seconds={row.time} />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.current_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.value}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.current_value}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </section>
    </Suspense>
  )
}
