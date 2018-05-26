import { MongooseDocument } from 'mongoose'
import { Request, Response } from 'express-serve-static-core'
import { EntityAccess } from '../security/types'

export type ModelResolverResult = {
  document: MongooseDocument
  meta?: any
}

export type ModelResolver = ( access: EntityAccess, document: MongooseDocument, model, req: Request, res: Response ) => Promise<ModelResolverResult>

export interface ModelResolverMap {
  [ title: string ]: ModelResolver
}
