import { FilePathSchema, TagsSchema, ReferenceSchema, MetaSchema } from './common'
import { EntitySchema } from '../../predicates/entity-schema';

// TODO - get this back into JSON and think of a more robust way to export it

export const zipFileSchema: EntitySchema = {
  id: 'http://workingspec.com/schema/zip-file',
  title: 'Zip File',
  description: 'A zip file stored on disk',
  type: 'object',
  format: 'entity-schema',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the zip file'
    },
    path: FilePathSchema( 'zip file' ),
    meta: MetaSchema(),
    filePaths: {
      title: 'File Paths',
      description: 'List of the paths in this zip',
      type: 'array',
      items: {
        title: 'Path',
        description: "Path to a file in the zip",
        type: 'string'
      }
    },
    tags: TagsSchema( 'zip file' )
  },
  additionalProperties: false,
  required: [ 'name', 'path', 'meta', 'filePaths' ]
}

export const zipFileReferenceSchema = ReferenceSchema( 'Zip File' )
