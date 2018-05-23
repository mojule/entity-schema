import { MongooseDocument, Model } from 'mongoose'

import {
  UserDocument, MongoUser, User, Roles, MongoApiKey, ApiKeyDocument
} from './types'

import * as bcrypt from 'bcrypt'

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
    ApiKey.findOne( { 'user.entityId': id }, ( err, apiKey: ApiKeyDocument ) => {
      if ( err ) return done( err )
      if ( apiKey === null ) return done( null, false )

      bcrypt.compare( secret, apiKey.secret, ( err, result ) => {
        if ( err ) return done( err )
        if ( !result ) return done( null, false )

        User.findById( apiKey.user.entityId, ( err, user: UserDocument ) => {
          if ( err ) return done( err )

          return done( null, user )
        })
      } )
    })
  }

  const serializeUser = ( user: UserDocument, cb ) => {
    cb( null, user._id.toString() )
  }

  const deserializeUser = ( id, cb ) => {
    User.findById( id, ( err, user: UserDocument ) => {
      if ( err ) return cb( err )
      if ( user === null ) return cb( Error( 'User was null' ) )

      const userModel: User = user.toJSON()

      const { email, roles } = userModel

      roles.push( Roles.currentUser )

      cb( null, { email, roles } )
    } )
  }

  return { strategy, apiKeyStrategy, serializeUser, deserializeUser }
}
