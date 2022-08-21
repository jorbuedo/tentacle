import { Component } from 'solid-js'

type AssetProps = { name: string; class?: string }

const Asset: Component<AssetProps> = (props) => {
  return (
    <div
      class="flex items-center space-x-2"
      classList={{ [props.class ?? '']: true }}
    >
      <span class="font-bold">{props.name}</span>
    </div>
  )
}

export default Asset
