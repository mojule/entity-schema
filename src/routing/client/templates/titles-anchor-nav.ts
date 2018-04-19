import { AnchorLinkItemTemplate } from './anchor-link-item'
import { AdminTemplateDeps } from './types';

export interface TitlesAnchorNavModel {
  routePrefix?: string,
  titles: string[],
  currentTitle?: string
}

export const TitlesAnchorNavTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { nav, ul } = h
  const AnchorLinkItem = AnchorLinkItemTemplate( deps )

  const TitlesAnchorNav = ( model: TitlesAnchorNavModel ) => {
    const {
      routePrefix = '',
      titles = [],
      currentTitle = ''
    } = model

    const anchorLinks = titles.map( title => {
      const path = routePrefix + '/' + title
      const isCurrent = title === currentTitle

      return AnchorLinkItem({ path, title, isCurrent })
    })

    const anchorNav = nav( ul( ...anchorLinks ) )

    return anchorNav
  }

  return TitlesAnchorNav
}
