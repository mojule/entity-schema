import { kebabCase } from 'lodash'
import * as path from 'path'
import { DiskStorageOptions } from 'multer'
import { is } from '@mojule/is'
import { Model, Document } from 'mongoose'
import { ensureDirectories } from '../utils/ensure-directories'

export interface ExtendedDiskStorageOptions extends DiskStorageOptions {
  zip?: ( ( req: Express.Request, file: Express.Multer.File, callback: ( error: Error | null, destination: string ) => void ) => void )
}

export interface FileResolverMap {
  [ title: string ]: ExtendedDiskStorageOptions
}

export interface FileMetadata {
  title: string
  Model: Model<Document>
  model?: Document
}

export const fileResolvers: FileResolverMap = {
  default: {
    destination: ( req, file, cb ) => {
      const { mimetype } = file
      const fileMetaData: FileMetadata = req[ '_wsMetadata' ]
      let { title, Model, model } = fileMetaData

      model = model || new Model()

      fileMetaData.model = model

      const rootDirectory = mimetype.startsWith( 'image' ) ? 'img' : 'files'
      const entityPath = `public/${ rootDirectory }/${ kebabCase( title ) }`
      const idSlug: string = is.string( model[ 'abbrev' ] ) ? model[ 'abbrev' ] : model.id
      const modelPath = `${ entityPath }/${ idSlug }`

      ensureDirectories( entityPath, modelPath )

      cb( null, modelPath )
    },
    filename: ( req, file, cb ) => {
      const parsed = path.parse( file.originalname )
      const filename = kebabCase( file.fieldname ) + parsed.ext

      cb( null, filename )
    }
  }
}
