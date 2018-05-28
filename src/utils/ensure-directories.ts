import * as fs from 'fs'
import * as path from 'path'

export const ensureParentFolders = ( targetPath: string ) => {
  const full = path.posix.resolve( '/', targetPath )
  const parsed = path.posix.parse( full )
  const { dir } = parsed
  const segs = dir.split( '/' ).filter( s => s !== '' )

  const parents: string[] = []
  const { length } = segs

  for ( let i = 0; i < length; i++ ) {
    const currentPath = segs.slice( 0, i + 1 )
    parents.push( currentPath.join( '/' ) )
  }

  ensureDirectories( ...parents )
}

export const ensureDirectories = ( ...paths ) => {
  paths.forEach( current => {
    if ( !fs.existsSync( current ) ) {
      fs.mkdirSync( current )
    }
  } )
}
