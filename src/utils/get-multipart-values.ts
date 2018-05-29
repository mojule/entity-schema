import { Request } from 'express-serve-static-core'
import * as Busboy from 'busboy'

export interface MultipartFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  stream: NodeJS.ReadableStream
  size: number
  destination: string
  filename: string
  path: string
  buffer: Buffer
}

export interface MultipartFields {
  [ pointer: string ]: string
}

export interface MultipartData {
  fields: MultipartFields
  files: MultipartFile[]
}

export const getMultipartData = async ( req: Request ) => new Promise <MultipartData>( (resolve, reject ) => {
  try {
    const { headers } = req
    const busboy = new Busboy( { headers } )

    const fields: MultipartFields = {}
    const files: MultipartFile[] = []

    busboy.on( 'field', ( key, value ) => fields[ key ] = value )
    busboy.on( 'file', ( fieldname, stream, originalname, encoding, mimetype ) => {
      const file: MultipartFile = {
        fieldname,
        originalname,
        encoding,
        mimetype,
        stream,
        size: 0,
        destination: '',
        filename: '',
        path: '',
        buffer: Buffer.from( '' )
      }

      files.push( file )
    })
    busboy.on( 'finish', () => resolve( { fields, files } ) )

    req.pipe( busboy )
  } catch( err ) {
    reject( err )
  }
})
