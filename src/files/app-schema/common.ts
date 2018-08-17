const defaultFileType = 'file'
const defaultTagType = 'item'

export const FilePathSchema = ( fileType = defaultFileType ) => ({
  title: 'Path',
  description: `Path to this ${ fileType }`,
  type: 'string'
})

export const TagsSchema = ( tagType = defaultTagType ) => ({
  title: 'Tags',
  description: `Tags to help categorize this ${ tagType }`,
  type: 'array',
  items: {
    title: 'Tag',
    description: `Tag for categorizing this ${ tagType }`,
    type: 'string'
  }
})

export const MetaSchema = () => ({
  tile: 'File Meta',
  descriptions: 'Metadata about the file',
  type: 'object',
  properties: {
    filename: {
      title: 'Filename',
      descriptions: 'The name of the file',
      type: 'string'
    },
    mimetype: {
      title: 'Mime Type',
      descriptions: 'The mime type of the file',
      type: 'string'
    },
    size: {
      title: 'Size',
      descriptions: 'The size of the file in bytes',
      type: 'integer'
    }
  },
  required: [ 'filename', 'mimetype', 'size' ]
})