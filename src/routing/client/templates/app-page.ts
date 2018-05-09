import { AnchorLinkItemModel, AnchorLinkItemTemplate } from './anchor-link-item'
import { AdminTemplateDeps } from './types'
import { strictSelect } from '@mojule/dom-utils'

export interface AppPageModel {
  currentPath? : string
}

export const AppPageTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { documentFragment, div, nav, ul } = h
  const AnchorLinkItem = AnchorLinkItemTemplate( deps )

  const AppPage = ( model: AppPageModel = {}, ...childNodes : Node[] ) => {
    const {
      currentPath = ''
    } = model

    const navList = nav( ul() )
    const main = div()
    const dom = documentFragment(
      navList, main
    )

    childNodes.forEach( childNode => {
      main.appendChild( childNode )
    })

    const anchorLinkModels : AnchorLinkItemModel[] = [
      { path: '/schema', title: 'Schema', isCurrent: currentPath === '/schema' },
      { path: '/entity', title: 'Entities', isCurrent: currentPath === '/entity' }
    ]

    anchorLinkModels.forEach( model => {
      const anchorLink = AnchorLinkItem( model )

      navList.appendChild( anchorLink )
    })

    return dom
  }

  return AppPage
}

