import { strictSelect } from '@mojule/dom-utils'

export const getApiKey = () => {
  const clientDiv = <HTMLDivElement>strictSelect( document, '.client' )
  const { apiKey } = clientDiv.dataset

  if ( apiKey )
    return 'Basic ' + apiKey
}
