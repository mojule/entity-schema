import * as fs from 'fs'
import * as path from 'path'
import { FileResolverMap } from '.'
import { DiskStorageOptions } from 'multer'
import { is } from '@mojule/is'

export type GetDestinationFn = ( req: Express.Request, file: Express.Multer.File, cb: ( error: null | Error, destination: string ) => void ) => void

export interface FileHandlerResult {
  path: string
  size: number
}

export type FileHandler = ( req: Express.Request, file: Express.Multer.File ) => Promise<FileHandlerResult>

export const EntityStorage = ( fileResolvers: FileResolverMap ) => {
  const getDestination: GetDestinationFn = ( req, file, cb ) => {
    const { title } = req[ '_wsMetadata' ]

    let destination: DiskStorageOptions[ 'destination' ]

    if ( title in fileResolvers ) {
      destination = fileResolvers[ title ].destination
    } else {
      destination = fileResolvers.default.destination
    }

    if ( is.string( destination ) || is.undefined( destination ) )
      throw Error( 'Expected diskStorage destination to be in function form' )

    destination( req, file, cb )
  }

  const _handleFile = ( req: Express.Request, file: Express.Multer.File, cb ) => {
    getDestination( req, file, ( err, outPath ) => {
      if ( err ) return cb( err )

      const { title } = req[ '_wsMetadata' ]
      const parsed = path.parse( file.originalname )

      if ( parsed.ext === '.zip' ) {
        if ( title in fileResolvers ) {
          const resolvers = fileResolvers[ title ]
          const { zip } = resolvers

          if ( zip !== undefined ) {
            return zip( req, file, ( err, outPath: string ) => {
              if ( err ) return cb( err )
              cb( null, {
                path: outPath,
                size: 0
              } )
            } )
          }
        }
      }

      let filename: DiskStorageOptions[ 'filename' ]

      if ( title in fileResolvers ) {
        filename = fileResolvers[ title ].filename
      } else {
        filename = fileResolvers.default.filename
      }

      if ( is.string( filename ) || is.undefined( filename ) )
        throw Error( 'Expected diskStorage filename to be in function form' )

      filename( req, file, ( err, filename ) => {
        outPath = path.join( outPath, filename )

        const outStream = fs.createWriteStream( outPath )

        file[ 'stream' ].pipe( outStream )

        outStream.on( 'error', cb )

        outStream.on( 'finish', function() {
          cb( null, {
            path: outPath,
            size: outStream.bytesWritten
          } )
        } )
      })
    } )
  }

  const _removeFile = ( req: Express.Request, file: Express.Multer.File, cb ) =>
    fs.unlink( file.path, cb )

  const api = { getDestination, _handleFile, _removeFile }

  return api
}
