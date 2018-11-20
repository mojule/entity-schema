import { apiKeyResolver } from './api-key'
import { ModelResolverMap } from './types'
import { userResolver } from './user'

export const modelResolvers: ModelResolverMap = {
  'API Key': apiKeyResolver,
  'User': userResolver
}
