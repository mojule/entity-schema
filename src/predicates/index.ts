import { is, Utils } from '@mojule/is'
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
import { isObjectSchema, IObjectSchema } from './object-schema'
import { isStringSchema, IStringSchema } from './string-schema'
import { isNumberSchema, INumberSchema } from './number-schema'
import { isBooleanSchema, IBooleanSchema } from './boolean-schema'
import { isArraySchema, IArraySchema } from './array-schema'

// object key order is important - will match in that order when finding types!
export const predicates = {
  oneOfSchema: isOneOfSchema,
  constPropertySchema: isConstPropertySchema,
  stringSchema: isStringSchema,
  numberSchema: isNumberSchema,
  booleanSchema: isBooleanSchema,
  arraySchema: isArraySchema,
  childEntitySchema: isChildEntitySchema,
  entitySchema: isEntitySchema,
  entityReferenceSchema: isEntityReferenceSchema,
  objectSchema: isObjectSchema,
  appSchema: isAppSchema,
  refSchema: isRefSchema,
  enumSchema: isEnumSchema,
  wsSchema: isWsSchema,
  subSchema: isSubschema,
  anySchema: ( value ) : value is any => is.object( value )
}

export const predicateUtils = Utils( predicates )
