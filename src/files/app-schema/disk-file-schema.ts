import { FilePathSchema, TagsSchema, MetaSchema } from './common'

// TODO - get this back into JSON and think of a more robust way to export it

export const diskFileSchema = {
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
