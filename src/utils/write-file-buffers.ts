import * as path from 'path'
import * as fs from 'fs'
import * as pify from 'pify'
import { ensureParentFolders } from './ensure-directories'

const writeFile = pify( fs.writeFile )

export interface FileBuffers {
  [ path: string ]: Buffer
}

export const writeFileBuffers = async ( rootPath: string, abbrev: string, fileBuffers: FileBuffers ) => {
  if( rootPath.includes( '\\' ) ) throw Error( 'Expected rootPath in posix format' )

  const paths = Object.keys( fileBuffers )

  return Promise.all( paths.map( filePath => {
    const buffer = fileBuffers[ filePath ]
    const destinationPath = path.posix.join( rootPath, abbrev )
    const writePath = path.posix.join( rootPath, abbrev, filePath )

    ensureParentFolders( writePath )

    return writeFile( writePath, buffer )
  } ) )
}
