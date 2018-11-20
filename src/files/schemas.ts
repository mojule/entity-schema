import { diskFileSchema } from './app-schema/disk-file-schema'
import { zipFileSchema } from './app-schema/zip-file-schema'
import { imageFileSchema } from './app-schema/image-file-schema'

export const fileSchemas = [
  diskFileSchema, imageFileSchema, zipFileSchema
]