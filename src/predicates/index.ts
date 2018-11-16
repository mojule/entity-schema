import { is, Utils } from '@mojule/is'
import { isOneOfSchema } from './oneof-schema'
import { isEntitySchema } from './entity-schema'
import { isRootSchema } from './root-schema'
import { isEnumSchema } from './enum-schema'
import { isRefSchema } from './ref-schema'
import { isChildEntitySchema } from './child-entity-schema'
import { isConstPropertySchema } from './const-property-schema'
import { isEntityReferenceSchema } from './entity-reference-schema'
import { isSubschema } from './subschema'
import { isTypedSchema } from './typed-schema'
import { isObjectSchema } from './object-schema'
import { isStringSchema } from './string-schema'
import { isNumberSchema } from './number-schema'
import { isBooleanSchema } from './boolean-schema'
import { isArraySchema } from './array-schema'
import { isIntegerSchema } from './integer-schema'

// object key order is important - will match in that order when finding types!
export const predicates = {
  oneOfSchema: isOneOfSchema,
  constPropertySchema: isConstPropertySchema,
  stringSchema: isStringSchema,
  numberSchema: isNumberSchema,
  integerSchema: isIntegerSchema,
  booleanSchema: isBooleanSchema,
  arraySchema: isArraySchema,
  childEntitySchema: isChildEntitySchema,
  entitySchema: isEntitySchema,
  entityReferenceSchema: isEntityReferenceSchema,
  objectSchema: isObjectSchema,
  appSchema: isRootSchema,
  refSchema: isRefSchema,
  enumSchema: isEnumSchema,
  wsSchema: isTypedSchema,
  subSchema: isSubschema,
  anySchema: ( value ) : value is any => is.object( value )
}

export const predicateUtils = Utils( predicates )
