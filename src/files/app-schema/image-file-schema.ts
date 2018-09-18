import { FilePathSchema, TagsSchema, ReferenceSchema } from './common'

// TODO - get this back into JSON and think of a more robust way to export it

export const imageFileSchema = {
  id: 'http://workingspec.com/schema/image-file',
  title: 'Image File',
  description: 'An image file stored on disk',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    path: FilePathSchema( 'image file' ),
    tags: TagsSchema( 'image file' )
  },
  additionalProperties: false,
  required: [ 'path' ]
}

export const imageFileReferenceSchema = ReferenceSchema( 'Image File' )
