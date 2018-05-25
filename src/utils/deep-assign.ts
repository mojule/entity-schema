import { flatten, expand } from "@mojule/json-pointer";

export const deepAssign = ( ...values ) => {
  if ( !values.length ) return

  const pointerMap = {}

  while ( values.length )
    Object.assign( pointerMap, flatten( values.shift() ) )

  return expand( pointerMap )
}
