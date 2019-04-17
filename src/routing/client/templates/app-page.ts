import { AnchorLinkItemModel, AnchorLinkItemTemplate } from './anchor-link-item'
import { AdminTemplateDeps } from './types'

export interface AppPageModel {
  currentPath? : string
}

export const AppPageTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { documentFragment, div, nav, ul } = h
  const AnchorLinkItem = AnchorLinkItemTemplate( deps )

  const AppPage = ( model: AppPageModel = {}, ...childNodes : Node[] ) => {
    const { currentPath = '' } = model

    const anchorLinkModels : AnchorLinkItemModel[] = [
      {
        path: '/schema',
        title: 'Schema',
        isCurrent: currentPath.startsWith( '/schema' )
      },
      {
        path: '/entity',
        title: 'Entities',
        isCurrent: currentPath.startsWith( '/entity' )
      },
      {
        path: '/files',
        title: 'Files',
        isCurrent: currentPath.startsWith( '/files')
      }
    ]

    return documentFragment(
      nav(
        { class: 'primary-nav' },
        ul(
          ...anchorLinkModels.map( AnchorLinkItem )
        )
      ),
      div( ...childNodes )
    )
  }

  return AppPage
}

