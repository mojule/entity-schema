import * as fs from 'fs'

export const ensureDirectories = ( ...paths ) => {
  paths.forEach( current => {
    if ( !fs.existsSync( current ) ) {
      fs.mkdirSync( current )
    }
  } )
}
