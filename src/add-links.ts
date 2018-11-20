import * as Mapper from '@mojule/mapper'
import { is } from '@mojule/is'
import { schemaWalk } from './schema-walk'
import {
  EntitySchema, isEntityReferenceSchema
} from '@entity-schema/predicates'

export interface ILink {
  _id: string,
  name: string
}

export interface ILinkMap {
  [ entityTitle: string ]: ILink[]
}

const clone = Mapper()

const predicates = {
  link: ( value ) : value is ILink =>
    is.object( value ) && is.string( value._id ) && is.string( value.name ),
  linkList: ( value ) : value is ILink[] =>
    is.array( value ) && value.every( predicates.link )
}

export const addLinks = ( schema: EntitySchema, linkMap: ILinkMap ) : EntitySchema => {
  schema = clone( schema )

  schemaWalk( schema, subSchema => {
    if( isEntityReferenceSchema( subSchema ) ){
      const title = subSchema.properties.entityType.default
      const links = linkMap[ title ]

      if( !predicates.linkList( links ) ) throw Error( `Expected a list of links for ${ title }` )

      subSchema.properties.entityId.enum = links.map( link => link._id )
      subSchema.properties.entityId._esTitles = links.map( link => link.name )
    }
  })

  return schema
}
