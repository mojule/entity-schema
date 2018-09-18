import { kebabCase } from "lodash";
import { IAppSchema } from "../../predicates/app-schema";

const defaultFileType = 'file'
const defaultTagType = 'item'

export const FilePathSchema = ( fileType = defaultFileType ): IAppSchema => ( {
  id: 'http://workingspec.com/schema/file-path',
  title: 'Path',
  description: `Path to this ${ fileType }`,
  type: 'string'
} )

export const TagsSchema = ( tagType = defaultTagType ): IAppSchema => ( {
  id: 'http://workingspec.com/schema/tags',
  title: 'Tags',
  description: `Tags to help categorize this ${ tagType }`,
  type: 'array',
  items: {
    title: 'Tag',
    description: `Tag for categorizing this ${ tagType }`,
    type: 'string'
  }
} )

export const MetaSchema = (): IAppSchema => ( {
  id: 'http://workingspec.com/schema/file-meta',
  title: 'File Meta',
  description: 'Metadata about the file',
  type: 'object',
  properties: {
    filename: {
      title: 'Filename',
      description: 'The name of the file',
      type: 'string'
    },
    mimetype: {
      title: 'Mime Type',
      description: 'The mime type of the file',
      type: 'string'
    },
    size: {
      title: 'Size',
      description: 'The size of the file in bytes',
      type: 'integer'
    }
  },
  required: [ 'filename', 'mimetype', 'size' ]
} )

export const ReferenceSchema = ( title: string ): IAppSchema => ( {
  id: `http://workingspec.com/schema/${ kebabCase( title ) }-reference`,
  title: `${ title } Reference`,
  description: `Links to a ${ title }`,
  type: `object`,
  properties: {
    entityId: {
      title,
      type: `string`,
      pattern: `^[0-9a-f]{24}$`,
      message: `${ title } must be a 24 character hex string. (0-9, a-f)`
    },
    entityType: {
      title: `Entity Type`,
      type: `string`,
      enum: [ title ],
      readOnly: true,
      default: title
    }
  },
  required: [ `entityId`, `entityType` ],
  additionalProperties: false
} )