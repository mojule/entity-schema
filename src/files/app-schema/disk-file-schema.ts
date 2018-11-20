import { FilePathSchema, TagsSchema, MetaSchema, ReferenceSchema } from './common'
import { EntitySchema } from '@entity-schema/predicates'

// TODO - get this back into JSON and think of a more robust way to export it

export const diskFileSchema: EntitySchema = {
  id: 'http://workingspec.com/schema/disk-file',
  title: 'Disk File',
  description: 'A file stored on disk',
  type: 'object',
  format: 'entity-schema',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the disk file'
    },
    path: FilePathSchema( 'file' ),
    meta: MetaSchema(),
    tags: TagsSchema( 'file' )
  },
  additionalProperties: false,
  required: [ 'name', 'path', 'meta' ]
}

export const diskFileReferenceSchema = ReferenceSchema( 'Disk File' )
