import { DocumentTemplates } from '../templates/types'

export const getDocumentTemplates = ( document: HTMLDocument ) => {
  const templates = <HTMLTemplateElement[]>Array.from(
    document.querySelectorAll( 'template[id]' )
  )

  const documentTemplates = templates.reduce( ( map, template ) => {
    map[ template.id ] = () => <DocumentFragment>template.content.cloneNode( true )

    return map
  }, <DocumentTemplates>{} )

  return documentTemplates
}

export const documentTemplates : DocumentTemplates = getDocumentTemplates( document )
