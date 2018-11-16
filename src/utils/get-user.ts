import { Request } from 'express-serve-static-core'
import { RootSchema } from '../predicates/root-schema'
import { Roles, EntityAccess } from '../security/types'
import { SchemaCollection } from '../schema-collection'
import { SchemaCollectionApi } from '../types'

export const getUser = ( req: Request ) => req.user || { roles: [ Roles.public ] }

export const getUserSchemas = ( req: Request, schemas: RootSchema[], accesses: EntityAccess[] ): SchemaCollectionApi =>
  SchemaCollection( schemas, getUser( req ).roles, accesses )
