import { FilePathSchema, TagsSchema, MetaSchema, ReferenceSchema } from './common'
import { IEntitySchema } from '../../predicates/entity-schema'

// TODO - get this back into JSON and think of a more robust way to export it

export const diskFileSchema: IEntitySchema = {
  id: 'http://workingspec.com/schema/disk-file',
  title: 'Disk File',
  description: 'A file stored on disk',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    path: FilePathSchema( 'file' ),
    meta: MetaSchema(),
    tags: TagsSchema( 'file' )
  },
  additionalProperties: false,
  required: [ 'path', 'meta' ]
}

export const diskFileReferenceSchema = ReferenceSchema( 'Disk File' )
