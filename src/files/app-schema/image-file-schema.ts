import { FilePathSchema, TagsSchema, ReferenceSchema, ImageMetaSchema } from './common'
import { IEntitySchema } from '../../predicates/entity-schema'

// TODO - get this back into JSON and think of a more robust way to export it

export const imageFileSchema: IEntitySchema = {
  id: 'http://workingspec.com/schema/image-file',
  title: 'Image File',
  description: 'An image file stored on disk',
  type: 'object',
  format: 'workingspec-entity',
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
