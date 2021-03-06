import { documentFragment, form, input, label, h2, select, option, h3 } from '../utils/h'
import { TitlesAnchorNav, AppPage, ErrorPage } from '../templates'
import { IClientRouterMap } from './client-router'
import { sendFile } from '../utils/fetch-json'
import { strictSelect } from '@mojule/dom-utils'

export const FileRoutes = ( resolverNames: string[] ): IClientRouterMap => {
  return {
    '/files': async ( _req, res ) => {
      const filesNav = TitlesAnchorNav( {
        routePrefix: '/files',
        titles: [ 'disk-file', 'image-file', 'zip-file' ],
        currentTitle: ''
      } )

      const content = documentFragment(
        h2( 'Files' ),
        filesNav
      )

      res.send( AppPage( { currentPath: '/files' }, content ) )
    },
    '/files/disk-file': async ( _req, res ) => {
      const formEl = form(
        {
          action: '/api/v1/files/create',
          method: 'post',
          enctype: 'multipart/form-data'
        },
        input(
          {
            type: 'file',
            name: 'createFile'
          }
        ),
        input(
          {
            type: 'submit',
            value: 'Create File'
          }
        )
      )

      const filesNav = TitlesAnchorNav( {
        routePrefix: '/files',
        titles: [ 'disk-file', 'image-file', 'zip-file' ],
        currentTitle: 'disk-file'
      } )

      const content = documentFragment(
        h2( 'Files' ),
        filesNav,
        h3( 'Upload File' ),
        formEl
      )

      formEl.addEventListener( 'submit', async e => {
        e.preventDefault()

        try {
          const newEntity = await sendFile( '/api/v1/files/create', formEl, 'POST' )

          if ( newEntity.filePaths ) {
            window.location.hash = `#/entity/zip-file/${ newEntity._id }`
          } else if ( newEntity.meta.width ) {
            window.location.hash = `#/entity/image-file/${ newEntity._id }`
          } else {
            window.location.hash = `#/entity/disk-file/${ newEntity._id }`
          }
        } catch ( err ) {
          res.send( ErrorPage( err ) )
        }
      } )

      res.send( AppPage( { currentPath: '/files' }, content ) )
    },
    '/files/image-file': async ( _req, res ) => {
      const formEl = form(
        {
          action: '/api/v1/files/create',
          method: 'post',
          enctype: 'multipart/form-data'
        },
        input(
          {
            type: 'file',
            name: 'createFile'
          }
        ),
        input(
          {
            type: 'submit',
            value: 'Create File'
          }
        )
      )

      const filesNav = TitlesAnchorNav( {
        routePrefix: '/files',
        titles: [ 'disk-file', 'image-file', 'zip-file' ],
        currentTitle: 'image-file'
      } )

      const content = documentFragment(
        h2( 'Files' ),
        filesNav,
        h3( 'Upload Image File' ),
        formEl
      )

      formEl.addEventListener( 'submit', async e => {
        e.preventDefault()

        try {
          const newEntity = await sendFile( '/api/v1/files/create', formEl, 'POST' )

          if ( newEntity.filePaths ) {
            window.location.hash = `#/entity/zip-file/${ newEntity._id }`
          } else if ( newEntity.meta.width ) {
            window.location.hash = `#/entity/image-file/${ newEntity._id }`
          } else {
            window.location.hash = `#/entity/disk-file/${ newEntity._id }`
          }
        } catch ( err ) {
          res.send( ErrorPage( err ) )
        }
      } )

      res.send( AppPage( { currentPath: '/files' }, content ) )
    },
    '/files/zip-file': async ( _req, res ) => {
      const formEl = form(
        {
          action: '/api/v1/files/create',
          method: 'post',
          enctype: 'multipart/form-data'
        },
        input(
          {
            type: 'file',
            name: 'createFile'
          }
        ),
        label(
          'Zip Type',
          select(
            { name: 'resolver' },
            ...resolverNames.map( name => option( name ) ),
            option( 'None' )
          )
        ),
        input(
          {
            type: 'submit',
            value: 'Create File'
          }
        )
      )

      const filesNav = TitlesAnchorNav( {
        routePrefix: '/files',
        titles: [ 'disk-file', 'image-file', 'zip-file' ],
        currentTitle: 'zip-file'
      } )

      const content = documentFragment(
        h2( 'Files' ),
        filesNav,
        h3( 'Upload Zip File' ),
        formEl
      )

      formEl.addEventListener( 'submit', async e => {
        e.preventDefault()

        try {
          const resolverEl = <HTMLSelectElement>strictSelect( formEl, 'select[name="resolver"]' )
          const resolver = resolverEl.options[ resolverEl.selectedIndex ].text
          const resolverSlug = resolver === 'None' ? '' : `/${ resolver }`
          const newEntity = await sendFile( `/api/v1/files/create${ resolverSlug }`, formEl, 'POST' )

          if ( newEntity.filePaths ) {
            window.location.hash = `#/entity/zip-file/${ newEntity._id }`
          } else if ( newEntity.meta.width ) {
            window.location.hash = `#/entity/image-file/${ newEntity._id }`
          } else {
            window.location.hash = `#/entity/disk-file/${ newEntity._id }`
          }
        } catch ( err ) {
          res.send( ErrorPage( err ) )
        }
      } )

      res.send( AppPage( { currentPath: '/files' }, content ) )
    }
  }
}

export const fileRoutes: IClientRouterMap = FileRoutes( [] )
