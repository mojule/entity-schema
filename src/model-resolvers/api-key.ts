import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import * as pify from 'pify'
import { Document } from 'mongoose'
import { ModelResolver } from './types'
import { EntityAccess, EntityAccesses } from '../security/types'

const hash = pify( bcrypt.hash )

export const apiKeyResolver: ModelResolver = async ( access: EntityAccess, document: Document ) => {
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
