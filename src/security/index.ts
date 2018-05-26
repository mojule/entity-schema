import { MongooseDocument, Model } from 'mongoose'

import {
  UserDocument, MongoUser, User, Roles, MongoApiKey, ApiKeyDocument
} from './types'

import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import * as pify from 'pify'
import { Request } from 'express-serve-static-core'

const hash = pify( bcrypt.hash )

export const PassportSecurity = ( User: MongoUser, ApiKey: MongoApiKey ) => {
  const strategy = ( email, password, done ) => {
    User.findOne( { email }, ( err, user: UserDocument ) => {
      if ( err ) return done( err )
      if ( user === null ) return done( null, false )

      bcrypt.compare( password, user.password, ( err, result ) => {
        if ( err ) return done( err )
        if ( !result ) return done( null, false )

        return done( null, user )
      } )
    } )
  }

  const apiKeyStrategy = ( id, secret, done ) => {
    ApiKey.findById( id, ( err, apiKeyDocument: ApiKeyDocument ) => {
      if ( err ) return done( err )
      if ( apiKeyDocument === null ) return done( null, false )

      bcrypt.compare( secret, apiKeyDocument.secret, ( err, result ) => {
        if ( err ) return done( err )
        if ( !result ) return done( null, false )

        User.findById( apiKeyDocument.user.entityId, ( err, user: UserDocument ) => {
          if ( err ) return done( err )

          return done( null, user )
        } )
      } )
    })
  }

  const serializeUser = ( user: UserDocument, cb ) => {
    cb( null, user._id.toString() )
  }

  const deserializeUser = ( _id, cb ) => {
    User.findById( _id, ( err, user: UserDocument ) => {
      if ( err ) return cb( err )
      if ( user === null ) return cb( Error( 'User was null' ) )

      const userModel: User = user.toJSON()

      const { name, email, roles } = userModel

      roles.push( Roles.currentUser )

      cb( null, { _id, name, email, roles } )
    } )
  }

  const createApiKey = async ( user: UserDocument, tags?: string[] ) => {
    const secret = uuid.v4()

    const apiKeyModel = {
      name: 'API Key for ' + user.name,
      user: {
        entityId: user._id.toString(),
        entityType: 'User'
      },
      secret,
      tags
    }

    const apiKeyDocument = new ApiKey( apiKeyModel )
    const apiKey = Buffer.from( `${ apiKeyDocument._id.toString() }:${ secret }` ).toString( 'base64' )

    apiKeyDocument.secret = await hash( secret, 10 )

    await apiKeyDocument.save()

    return {
      apiKey,
      apiKeyId: <string>apiKeyDocument._id.toString()
    }
  }

  const getSessionApiKey = async ( req: Request ) => {
    const { session } = <any>req

    if( session.apiKey ) return session.apiKey

    if( !req.user ) throw Error( 'No user!' )

    const { user } = req

    const sessionApis = await ApiKey.find( {
      'user.entityId': user._id.toString(),
      tags: 'session'
    } )

    await Promise.all( sessionApis.map( sessionApi => sessionApi.remove() ) )

    const apiKey = await createSessionApiKey( <UserDocument>user )

    session.apiKey = apiKey.apiKey

    return session.apiKey
  }

  const createSessionApiKey = async ( user: UserDocument ) =>
    createApiKey( user, [ 'session' ] )

  return {
    strategy, apiKeyStrategy, serializeUser, deserializeUser, createApiKey,
    createSessionApiKey, getSessionApiKey
  }
}

