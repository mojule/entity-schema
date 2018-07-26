import { Request } from 'express-serve-static-core'
import { IAppSchema } from '../predicates/app-schema'
import { Roles, EntityAccess } from '../security/types'
import { SchemaCollection } from '../schema-collection'
import { SchemaCollectionApi } from '../types'

export const getUser = ( req: Request ) => req.user || { roles: [ Roles.public ] }

export const getUserSchemas = ( req: Request, schemas: IAppSchema[], accesses: EntityAccess[] ): SchemaCollectionApi =>
  SchemaCollection( schemas, getUser( req ).roles, accesses )
