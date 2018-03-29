import { JSONSchema4 } from 'json-schema'
import { is } from '@mojule/is'

export interface IRefSchema extends JSONSchema4 {
  $ref: string
}

export const isRefSchema = ( value ) : value is IRefSchema =>
  is.object( value ) &&
  is.string( value.$ref )
