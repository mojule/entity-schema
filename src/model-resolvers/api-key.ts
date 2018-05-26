import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import * as pify from 'pify'
import { Request, Response } from 'express-serve-static-core'
import { MongooseDocument, Model } from 'mongoose'
import { ModelResolver, ModelResolverResult } from './types';
import { EntityAccess, EntityAccesses } from '../security/types';

const hash = pify( bcrypt.hash )

export const apiKeyResolver: ModelResolver = async ( access: EntityAccess, document: MongooseDocument, model, req: Request, res: Response ) => {
  if( access !== EntityAccesses.create ) return { document }

  const secret = uuid.v4()
  const apiKey = Buffer.from( `${ document._id.toString() }:${ secret }` ).toString( 'base64' )

  document[ 'secret' ] = await hash( secret, 10 )

  const meta = {
    apiKey,
    message: `
      Your new API key is ${ apiKey } - please save this somewhere safe, as you
      will not be able to retrieve it. If you lose it, delete the old key and
      generate a new one.
    `
  }

  return { document, meta }
}
