import { AdminTemplateDeps } from './types'

export interface AnchorLinkItemModel {
  path: string,
  title: string,
  isCurrent?: boolean
}

export const AnchorLinkItemTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { li, a } = h

  const AnchorLinkItem = ( model: AnchorLinkItemModel ) => {
    const { path, title, isCurrent = false } = model

    const item = li(
      a( { href: `#${ path }` }, title )
    )

    item.classList.toggle( 'current', isCurrent )

    return item
  }

  return AnchorLinkItem
}
