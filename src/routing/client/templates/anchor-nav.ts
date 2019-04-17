import { AnchorLinkItemTemplate, AnchorLinkItemModel } from './anchor-link-item'
import { AdminTemplateDeps } from './types'

export const AnchorNavTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { nav, ul } = h
  const AnchorLinkItem = AnchorLinkItemTemplate( deps )

  const AnchorNav = ( model: AnchorLinkItemModel[] ) => {
    const anchorLinks = model.map( AnchorLinkItem )

    const anchorNav = nav( ul( ...anchorLinks ) )

    return anchorNav
  }

  return AnchorNav
}
