import { AppPageTemplate } from './app-page'
import { AdminTemplateDeps } from './types'

export const ErrorPageTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { documentFragment, h2, p, h3, pre } = h
  const AppPage = AppPageTemplate( deps )

  const ErrorPage = ( model: Error ) => {
    return AppPage(
      {},
      h2( 'Error' ),
      h3( model.name ),
      pre( model.message ),
      pre( model.stack || '' )
    )
  }

  return ErrorPage
}
