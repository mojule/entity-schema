import { IPredicateMap } from '../../types/predicate-map'
import { TPredicate } from '../../types/predicate'
import { is } from '@mojule/is'
import { isOneOfSchema, IOneOfSchema } from './oneof-schema'
import { isEntitySchema, IEntitySchema } from './entity-schema'
import { isAppSchema, IAppSchema } from './app-schema'
import { isEnumSchema, IEnumSchema } from './enum-schema'
import { isRefSchema, IRefSchema } from './ref-schema'
import { isChildEntitySchema, IChildEntitySchema } from './child-entity-schema'
import { IConstPropertySchema, isConstPropertySchema } from './const-property-schema'
import { IEntityReferenceSchema, isEntityReferenceSchema } from './entity-reference-schema'
import { isSubschema, TSubschema } from './subschema'
import { isWsSchema, IWsSchema } from './ws-schema'

const TypedSchemaPredicate = ( type ) : TPredicate<any> =>
  ( value ) : value is any => is.object( value ) && value.type === type

export interface ISchemaPredicates extends IPredicateMap {
  oneOfSchema: TPredicate<IOneOfSchema>
  constPropertySchema: TPredicate<IConstPropertySchema>
  stringSchema: TPredicate<any>
  numberSchema: TPredicate<any>
  booleanSchema: TPredicate<any>
  nullSchema: TPredicate<any>
  arraySchema: TPredicate<any>
  childEntitySchema: TPredicate<IChildEntitySchema>
  entitySchema: TPredicate<IEntitySchema>
  appSchema: TPredicate<IAppSchema>
  refSchema: TPredicate<IRefSchema>
  entityReferenceSchema: TPredicate<IEntityReferenceSchema>
  objectSchema: TPredicate<any>
  enumSchema: TPredicate<IEnumSchema>
  anySchema: TPredicate<any>
  subSchema: TPredicate<TSubschema>
  wsSchema: TPredicate<IWsSchema>
}

// object key order is important - will match in that order when finding types!
export const predicates : ISchemaPredicates = {
  oneOfSchema: isOneOfSchema,
  constPropertySchema: isConstPropertySchema,
  stringSchema: TypedSchemaPredicate( 'string' ),
  numberSchema: TypedSchemaPredicate( 'number' ),
  booleanSchema: TypedSchemaPredicate( 'boolean' ),
  nullSchema: TypedSchemaPredicate( 'null' ),
  arraySchema: TypedSchemaPredicate( 'array' ),
  childEntitySchema: isChildEntitySchema,
  entitySchema: isEntitySchema,
  entityReferenceSchema: isEntityReferenceSchema,
  appSchema: isAppSchema,
  objectSchema: TypedSchemaPredicate( 'object' ),
  refSchema: isRefSchema,
  enumSchema: isEnumSchema,
  wsSchema: isWsSchema,
  subSchema: isSubschema,
  anySchema: ( value ) : value is any => is.object( value )
}
