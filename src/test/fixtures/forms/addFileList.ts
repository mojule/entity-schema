const { JSDOM } = require( 'jsdom' )
const { File, FileList } = ( new JSDOM() ).window

export const createFile = ( buffer: Buffer, name: string, properties: any ) =>
  new File( buffer, name, properties )

export const addFileList = ( input, files: File[] ) => {

  files[ '__proto__' ] = Object.create( FileList.prototype )

  Object.defineProperty( input, 'files', {
    value: files,
    writable: false,
  } )

  return input
}
