import { ArrayifyApi } from './arrayify-schema-form'
import { OneOfApi } from './oneof-schema-form'

export type SchemaFieldEditor = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export const ArrayifySymbol = Symbol( 'arrayify' )
export const OneOfSymbol = Symbol( 'oneOf' )

export interface SchemaFormElement extends HTMLFormElement {
  [ ArrayifySymbol ]: ArrayifyApi
  [ OneOfSymbol ]: OneOfApi
}
