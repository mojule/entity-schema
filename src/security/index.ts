import { MongooseDocument, Model } from 'mongoose'
import { UserDocument, MongoUser, User, Roles } from './types'
import * as bcrypt from 'bcrypt'

export const PassportSecurity = ( User: MongoUser ) => {
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

  return { strategy, serializeUser, deserializeUser }
}
