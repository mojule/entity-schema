import { JSONSchema4 } from 'json-schema'
import { is } from '@mojule/is'

export interface RefSchema extends JSONSchema4 {
  $ref: string
}

export const isRefSchema = ( value ) : value is RefSchema =>
  is.object( value ) &&
  is.string( value.$ref )
