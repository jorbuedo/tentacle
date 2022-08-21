import { view } from '.'

export const errorBack = (err: Error | null) => {
  if (err) {
    view.error(err)
  }
}
