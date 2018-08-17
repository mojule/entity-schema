import { userSchema } from './app-schema/user-schema'
import { userReferenceSchema } from './app-schema/user-reference-schema'
import { apiKeySchema } from './app-schema/api-key-schema'

export const securitySchemas = [ userSchema, userReferenceSchema, apiKeySchema ]
