export const hashToPath = ( hash: string ) => {
  let path = '/'

  if( hash.length ){
    path = hash.slice( 1 )

    if( !path.startsWith( '/' ) )
      path = '/' + path
  }

  return path
}
