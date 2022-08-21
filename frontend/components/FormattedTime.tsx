import { Component, createMemo, Show } from 'solid-js'

type FormattedTimeProps = {
  class?: string
  seconds?: number
  milliseconds?: number
  /** Options can be found at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat */
  options?: Intl.DateTimeFormatOptions
}

const FormattedTime: Component<FormattedTimeProps> = (props) => {
  const value = createMemo(() => {
    const result = props.seconds ? props.seconds * 1000 : props.milliseconds
    return result
  })

  return (
    <Show when={value() !== undefined}>
      <span
        classList={{
          [props.class ?? '']: true,
        }}
        title={'' + value()}
      >
        {new Intl.DateTimeFormat(undefined, props.options).format(
          new Date(Number(value()))
        )}
      </span>
    </Show>
  )
}

export default FormattedTime
