import { Request, Response } from 'express-serve-static-core'
import { errorToObj } from '../../utils/error-to-object'

export const jsonError = ( res: Response, err: Error | IServerError, status?: number ) => {
  if ( !status ) {
    if ( err instanceof NotFoundError || err instanceof UserError ) {
      status = err.code
    } else {
      status = 500
    }
  }

  res.status( status ).json( errorToObj( err, true ) )
}

export const notFoundError = ( res: Response, err: Error ) => jsonError( res, err, 404 )

export const serverError = ( res: Response, err: Error ) => jsonError( res, err, 500 )

export const userError = ( res: Response, err: Error ) => jsonError( res, err, 400 )

export interface IServerError extends Error {
  code: number
}

export class NotFoundError extends Error implements IServerError {
  code: number
  constructor( message: string ) {
    super( message )
    this.code = 404
    Object.setPrototypeOf( this, NotFoundError.prototype )
  }
}

export class UserError extends Error implements IServerError {
  code: number
  constructor( message: string ) {
    super( message )
    this.code = 400
    Object.setPrototypeOf( this, UserError.prototype )
  }
}
