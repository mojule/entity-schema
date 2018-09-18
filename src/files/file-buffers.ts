import * as path from 'path'
import * as fs from 'fs'
import * as pify from 'pify'
import * as yauzl from 'yauzl'
import * as yazl from 'yazl'

import { FilePathBuffers } from '../files/types'
import { ensureParentFolders } from '../utils/ensure-directories'

const writeFile = pify( fs.writeFile )
const readFile = pify( fs.readFile )

const assertPosixPath = ( targetPath: string, name: string ) => {
  if ( targetPath.includes( '\\' ) ) throw Error( `Expected ${ name } in posix format` )
}

export const writeFileBuffers = async ( rootPath: string, fileBuffers: FilePathBuffers ) => {
  assertPosixPath( rootPath, 'rootPath' )

  const paths = Object.keys( fileBuffers )

  return Promise.all( paths.map( filePath => {
    assertPosixPath( filePath, 'filePath' )

    const buffer = fileBuffers[ filePath ]
    const writePath = path.posix.join( rootPath, filePath )

    ensureParentFolders( writePath )

    return writeFile( writePath, buffer )
  } ) )
}

export const readFileBuffers = async ( paths: string[] ) => {
  paths.forEach( ( current, i ) =>
    assertPosixPath( current, `paths[${ i }]` )
  )

  const fileBuffers: FilePathBuffers = {}

  return Promise.all( paths.map( async filePath => {
    fileBuffers[ filePath ] = await readFile( filePath )
  })).then( () => fileBuffers )
}

export const missingPathsInFileBuffers = ( fileBuffers: FilePathBuffers, paths: string[] ) => {
  const fileBufferPaths = Object.keys( fileBuffers )

  return paths.filter( p => !fileBufferPaths.includes( p ) )
}

export const hasPathsInFileBuffers = ( fileBuffers: FilePathBuffers, paths: string[] ) =>
  missingPathsInFileBuffers( fileBuffers, paths ).length === 0

export interface ZipToFileBuffersOptions {
  filter: ( fileName: string ) => boolean
  map: ( fileName: string ) => string
}

const defaultZipToFileBuffersOptions: ZipToFileBuffersOptions = {
  filter: _s => true,
  map: s => s
}

export const zipBufferToFileBuffers = async ( zipFileBuffer: Buffer, options = defaultZipToFileBuffersOptions ) => {
  options = { ...defaultZipToFileBuffersOptions, ...options }
  const { filter, map } = options

  const fileBuffers: FilePathBuffers = {}

  return new Promise<FilePathBuffers>( ( resolve, reject ) => {
    yauzl.fromBuffer(
      zipFileBuffer,
      { lazyEntries: true },
      ( err, zipfile ) => {
        if ( err ) {
          reject( err )
          return
        }

        zipfile.readEntry()

        zipfile.on( 'entry', entry => {
          // skip empty folders and unexpected files
          if ( /\/$/.test( entry.fileName ) ) {
            zipfile.readEntry()
          } if( !filter( entry.fileName ) ){
            zipfile.readEntry()
          } else {
            let chunks: Buffer[] = []

            zipfile.openReadStream( entry, ( err, readStream ) => {
              if ( err ) return reject( err )
              if ( readStream === undefined )
                return reject( Error( 'no readStream' ) )

              readStream.on( 'data',
                ( chunk: Buffer ) => chunks.push( chunk )
              )
              readStream.on( 'end', () => {
                const buffer = Buffer.concat( chunks )
                const fileName = map( entry.fileName )

                fileBuffers[ fileName ] = buffer

                zipfile.readEntry()
              } )
              readStream.on( 'error', err => {
                reject( err )
              } )
            } )
          }
        } )

        zipfile.on( 'error', err => {
          reject( err )
        } )

        // use end with fromBuffer because close is only emitted when streaming
        zipfile.on( 'end', () => {
          resolve( fileBuffers )
        } )
      }
    )
  })
}

const defaultBeforeEnd = async ( _zip: any ) => {}

export const fileBuffersToZipBuffer = async ( fileBuffers: FilePathBuffers, beforeEnd = defaultBeforeEnd ): Promise<Buffer> => {
  const zip = new yazl.ZipFile()

  Object.keys( fileBuffers ).forEach( key =>
    zip.addBuffer( fileBuffers[ key ], key, {
      mtime: new Date(),
      mode: parseInt( "0100664", 8 )
    })
  )

  await beforeEnd( zip )

  return new Promise<Buffer>( ( resolve, reject ) => {
    try {
      const bufs: Buffer[] = []
      zip.outputStream.on( 'data', d => bufs.push( d ) )
      zip.outputStream.on( 'end', () => resolve( Buffer.concat( bufs ) ) )
      zip.end()
    } catch( err ){
      reject( err )
    }
  })
}