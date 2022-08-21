import { Component, Show } from 'solid-js'

type FormattedNumberProps = {
  class?: string
  value?: number
  isColored?: boolean
  /** Options can be found at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat */
  options?: Intl.NumberFormatOptions
}

const FormattedNumber: Component<FormattedNumberProps> = (props) => {
  return (
    <Show when={props.value !== undefined}>
      <span
        classList={{
          [getColorByValue(props.value as number)]: props.isColored,
          [props.class ?? '']: true,
        }}
        title={'' + props.value}
      >
        {new Intl.NumberFormat(undefined, props.options).format(
          props.value as number
        )}
      </span>
    </Show>
  )
}

export default FormattedNumber

const getColorByValue = (value: number) => {
  switch (true) {
    case value > 0:
      return 'text-green-800 dark:text-green-300'
    case value < 0:
      return 'text-red-800 dark:text-red-300'
    default:
      return ''
  }
}
