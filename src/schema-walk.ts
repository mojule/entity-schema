import * as Mapper from '@mojule/mapper'
import { predicates } from './predicates'
import { is } from '@mojule/is'
import { JSONSchema4 } from 'json-schema'

const doCallback = ( schema, options ) => {
  const { callback, pathSegs } = options
  const path = '/' + pathSegs.join( '/' )

  callback( schema, path )
}

const map = {
  oneOfSchema: ( schema, options ) => {
    const { pathSegs, mapper } = options

    doCallback( schema, options )

    schema.oneOf.forEach( ( subSchema, i ) => {
      const newPathSegs = ( <string[]>pathSegs ).concat(  [ `?${ i }` ] )
      const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs } )

      mapper( subSchema, newOptions )
    })
  },
  constPropertySchema: doCallback,
  stringSchema: doCallback,
  numberSchema: doCallback,
  booleanSchema: doCallback,
  nullSchema: doCallback,
  arraySchema: ( schema, options ) => {
    const { pathSegs, mapper } = options

    doCallback( schema, options )

    if( schema.items ){
      const newPathSegs = ( <string[]>pathSegs ).concat(  [ '[]' ] )
      const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs } )

      mapper( schema.items, newOptions )
    }
  },
  childEntitySchema: ( schema, options ) => {
    map.objectSchema( schema, options )
  },
  entitySchema: ( schema, options ) => {
    map.objectSchema( schema, options )
  },
  entityReferenceSchema: ( schema, options ) => {
    map.objectSchema( schema, options )
  },
  objectSchema: ( schema, options ) => {
    const { pathSegs, mapper } = options

    doCallback( schema, options )

    if( is.object( schema.properties ) && !is.empty( schema.properties ) ){
      Object.keys( schema.properties ).forEach( key => {
        const newPathSegs = ( <string[]>pathSegs ).concat( [ key ] )
        const newOptions = Object.assign( {}, options, { pathSegs: newPathSegs } )

        mapper( schema.properties[ key ], newOptions )
      })
    }
  },
  refSchema: () => {
    throw Error( 'Found a $ref - schema should have been normalized!' )
  },
  anySchema: () => {
    throw Error( 'Any type not supported')
  }
}

export const schemaWalk = ( schema: JSONSchema4, callback ) => {
  const mapper = Mapper( { map, predicates } )

  mapper( schema, { callback, pathSegs: [] } )
}
