import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import * as pify from 'pify'
import { Request, Response } from 'express-serve-static-core'
import { MongooseDocument, Document, Model } from 'mongoose'
import { ModelResolver, ModelResolverResult } from './types'
import { EntityAccess, EntityAccesses } from '../security/types'

const hash = pify( bcrypt.hash )

export const userResolver: ModelResolver = async ( access: EntityAccess, document: Document, model, req: Request, res: Response ) => {
  if( access === EntityAccesses.create || access === EntityAccesses.update ){
    document[ 'password' ] = await hash( model.password, 10 )
  }

  return { document }
}
