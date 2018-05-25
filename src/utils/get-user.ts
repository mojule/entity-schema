import { Request } from 'express-serve-static-core'
import { ISchemaMap } from '../schema-map'
import { IAppSchema } from '../predicates/app-schema'
import { Roles, EntityAccess } from '../security/types'
import { SchemaCollection } from '../schema-collection'
import { IEntitySchema } from '../predicates/entity-schema'
import { JSONSchema4 } from 'json-schema'
import { Schema } from 'mongoose'
import { TV4 } from 'tv4'

export const getUser = ( req: Request ) => req.user || { roles: [ Roles.public ] }

export const getUserSchemas = ( req: Request, schemas: IAppSchema[], accesses: EntityAccess[] ) =>
  SchemaCollection( schemas, getUser( req ).roles, accesses )