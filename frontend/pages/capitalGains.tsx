import { useRouteData } from '@solidjs/router'
import { For, Suspense } from 'solid-js'
import Asset from '~/components/Asset'
import FormattedNumber from '~/components/FormattedNumber'
import FormattedTime from '~/components/FormattedTime'
import { CapitalGainsDataType } from './capitalGains.data'

export default function CapitalGains() {
  const data = useRouteData<CapitalGainsDataType>()

  return (
    <Suspense fallback="Loading...">
      <section class="bg-grey-200 dark:text-grey-200 flex place-content-center p-4">
        <article class="flex flex-col text-center">
          <FormattedNumber
            class="text-xl font-bold"
            value={data()?.capitalGainsTotal[0]?.total_gainloss}
            options={{
              style: 'currency',
              currency: 'EUR',
            }}
          />
          <span class="text-xs">Total gain/loss</span>
        </article>
      </section>
      <section class="bg-grey-100 max-w-full overflow-auto p-2">
        <table class="custom-table">
          <thead>
            <tr>
              <For
                each={['asset', 'amount', 'avg. buy', 'avg. sell', 'gainloss']}
              >
                {(name, i) => <th data-index={i()}>{name}</th>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={data()?.capitalGainsSummary}>
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
                      value={row.avg_buy_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.avg_sell_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.gainloss}
                      isColored
                      options={{
                        style: 'currency',
                        currency: 'EUR',
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
                  'buy time',
                  'sell time',
                  'period',
                  'buy price',
                  'sell price',
                  'gainloss',
                ]}
              >
                {(name, i) => <th data-index={i()}>{name}</th>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={data()?.capitalGainsTransactions}>
              {(row, i) => (
                <tr data-index={i()}>
                  <td>
                    <Asset name={row.asset} class="w-24" />
                  </td>
                  <td>
                    <FormattedNumber value={row.amount} />
                  </td>
                  <td>
                    <FormattedTime
                      class="grow text-right"
                      seconds={row.buy_time}
                    />
                  </td>{' '}
                  <td>
                    <FormattedTime
                      class="grow text-right"
                      seconds={row.sell_time}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.holding_period}
                    />
                    <FormattedNumber
                      class="grow text-right"
                      value={row.buy_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.sell_price}
                      options={{
                        style: 'currency',
                        currency: 'EUR',
                      }}
                    />
                  </td>
                  <td>
                    <FormattedNumber
                      class="grow text-right"
                      value={row.gainloss}
                      isColored
                      options={{
                        style: 'currency',
                        currency: 'EUR',
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
    </Suspense>
  )
}
