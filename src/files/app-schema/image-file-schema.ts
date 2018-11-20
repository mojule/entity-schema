import { FilePathSchema, TagsSchema, ReferenceSchema, ImageMetaSchema } from './common'
import { EntitySchema } from '@entity-schema/predicates'

// TODO - get this back into JSON and think of a more robust way to export it

export const imageFileSchema: EntitySchema = {
  id: 'http://workingspec.com/schema/image-file',
  title: 'Image File',
  description: 'An image file stored on disk',
  type: 'object',
  format: 'entity-schema',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      description: 'The name of the image file'
    },
    path: FilePathSchema( 'image file' ),
    meta: ImageMetaSchema(),
    tags: TagsSchema( 'image file' )
  },
  additionalProperties: false,
  required: [ 'name', 'path', 'meta' ]
}

export const imageFileReferenceSchema = ReferenceSchema( 'Image File' )
