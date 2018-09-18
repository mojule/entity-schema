import { FilePathSchema, TagsSchema, ReferenceSchema } from './common'

// TODO - get this back into JSON and think of a more robust way to export it

export const zipFileSchema = {
  id: 'http://workingspec.com/schema/zip-file',
  title: 'Zip File',
  description: 'A zip file stored on disk',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
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
  required: [ 'path' ]
}

export const zipFileReferenceSchema = ReferenceSchema( 'Zip File' )
