/*
  Consider making async - but we use in scenarios where you would typically
  use require(), which is synchronous anyway, so no big deal
*/
import * as fs from 'fs'
import * as path from 'path'
import { JSONSchema4 } from 'json-schema'

const schemaFilePredicate = filename => filename.endsWith( '.schema.json' )

const directoryPredicate = ( filename, currentPath ) => {
  const stats = fs.lstatSync( path.join( currentPath, filename ) )

  return stats.isDirectory()
}

const schemaCache = new Map<string,JSONSchema4[]>()

export const loadSchemas = ( schemaPath: string ) => {
  if( schemaCache.has( schemaPath ) ) return <JSONSchema4[]>schemaCache.get( schemaPath )

  const schemas : JSONSchema4[] = []
  const files = fs.readdirSync( schemaPath )

  files.forEach( filename => {
    if( schemaFilePredicate( filename ) ){
      const filePath = path.join( schemaPath, filename )
      const json = fs.readFileSync( filePath, 'utf8' )
      const schema : JSONSchema4 = JSON.parse( json )

      schemas.push( schema )
    } else if( directoryPredicate( filename, schemaPath ) ){
      const newPath = path.join( schemaPath, filename )
      const directorySchemas = loadSchemas( newPath )

      schemas.push( ...directorySchemas )
    }
  })

  schemaCache.set( schemaPath, schemas )

  return schemas
}
