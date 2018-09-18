import { FilePathSchema, TagsSchema, ReferenceSchema } from './common'
import { IEntitySchema } from '../../predicates/entity-schema';

// TODO - get this back into JSON and think of a more robust way to export it

export const zipFileSchema: IEntitySchema = {
  id: 'http://workingspec.com/schema/zip-file',
  title: 'Zip File',
  description: 'A zip file stored on disk',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the zip file'
    },
    path: FilePathSchema( 'zip file' ),
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
  required: [ 'name', 'path', 'filePaths' ]
}

export const zipFileReferenceSchema = ReferenceSchema( 'Zip File' )
