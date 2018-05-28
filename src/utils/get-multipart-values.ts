import { Request } from 'express-serve-static-core'
import * as Busboy from 'busboy'

export const getMultipartFields = async ( req: Request ) => new Promise( (resolve, reject ) => {
  try {
    const { headers } = req
    const busboy = new Busboy( { headers } )

    const fields = {}

    busboy.on( 'field', ( key, value ) => fields[ key ] = value )

    busboy.on( 'finish', function() {
      resolve( fields )
    } )

    req.pipe( busboy )
  } catch( err ) {
    reject( err )
  }
})
