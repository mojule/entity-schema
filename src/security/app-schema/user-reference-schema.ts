import { IAppSchema } from '../../predicates/app-schema'

export const userReferenceSchema: IAppSchema = {
  id: 'http://workingspec.com/schema/user-reference',
  title: 'User Reference',
  description: 'Links to a User',
  type: 'object',
  properties: {
    entityId: {
      title: 'User',
      type: 'string',
      pattern: '^[0-9a-f]{24}$',
      message: 'User must be a 24 character hex string. (0-9, a-f)'
    },
    entityType: {
      title: 'Entity Type',
      type: 'string',
      enum: [ 'User' ],
      readOnly: true,
      default: 'User'
    }
  },
  required: [ 'entityId', 'entityType' ],
  additionalProperties: false
}
