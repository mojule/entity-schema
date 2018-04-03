import * as camelCase from 'lodash.camelcase'
import * as upperFirst from 'lodash.upperfirst'

export const pascalCase = ( str: string ): string =>
  upperFirst( camelCase( str ) )
