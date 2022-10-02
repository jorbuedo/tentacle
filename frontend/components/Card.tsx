import { ParentComponent } from 'solid-js'

type CardProps = {
  outterClass?: string
  innerClass?: string
}

const Card: ParentComponent<CardProps> = (props) => {
  return (
    <article
      class="mx-auto max-w-7xl sm:px-6 lg:px-8"
      classList={{ [props.outterClass ?? '']: true }}
    >
      <div class="mx-auto max-w-none">
        <div class="overflow-hidden bg-white dark:bg-black sm:rounded-lg sm:shadow">
          <div classList={{ [props.innerClass ?? '']: true }}>
            {props.children}
          </div>
        </div>
      </div>
    </article>
  )
}

export default Card
