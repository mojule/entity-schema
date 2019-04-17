import { fetchJson, postJson, putJson, fetchJsonMultiple, postFormData, putFormData, postDelete } from '../utils/fetch-json'
import { documentFragment, h2, h3, h4, input, p, form } from '../utils/h'
import { objectToDom } from '../utils/object-to-dom'
import { startCase, kebabCase } from 'lodash'
import { AnchorNav, ErrorPage, AppPage, ActionList } from '../templates'
import { linkTitlesForSchema } from '../../../link-titles-for-schema'
import { addLinks } from '../../../add-links'
import { IClientRouterMap } from './client-router'
import { uploadablePropertyNames } from '../../../uploadable-properties'
import { is } from '@mojule/is'
import { EntitySchema } from '@entity-schema/predicates'
import { ClientFormTemplates, SchemaToFormElements, getEntries, entriesToPointers } from '@mojule/schema-forms'
import { expand } from '@mojule/json-pointer';
import { JSONSchema4 } from 'json-schema';
import { getApiKey } from '../utils/get-api-key'
import { entityTypesToLinks, entityIdsForTypeToLinks } from '../utils/ids-to-links';

const templates = ClientFormTemplates( document, Event )
const toFormElements = SchemaToFormElements( templates )

const toForm = ( schema: JSONSchema4, name?: string, value? ) =>
  form( toFormElements( schema, name, value ) )

const schemaWithLinks = async ( schema, authorize?: string ) => {
  const linkTitles = linkTitlesForSchema( schema )

  const fetchJsonMap = linkTitles.reduce( ( map, title ) => {
    map[ title ] = `/api/v1/${ kebabCase( title ) }/all`
    return map
  }, {} )

  const linkedEntities = await fetchJsonMultiple( fetchJsonMap, authorize )

  const linkMap = Object.keys( linkedEntities ).reduce( ( map, title ) => {
    const entities = linkedEntities[ title ]

    map[ title ] = entities.map( entity => {
      const { _id, name } = entity

      return { _id, name }
    } )

    return map
  }, {} )

  return addLinks( schema, linkMap )
}

const getSchema = async ( title: string, authorize?: string ): Promise<EntitySchema> => {
  const normalizedSchema: EntitySchema = await fetchJson( `/schema/${ title }/normalized`, authorize )
  const schema: EntitySchema = await schemaWithLinks( normalizedSchema, authorize )

  return schema
}

let message: string | null = null

// destructive! allows for one-time messages
const getMessage = () => {
  if( is.string( message ) ){
    const result = <string>message

    message = null

    return result
  }
}

export const entityRoutes: IClientRouterMap = {
  '/entity/:title/create': async ( req, res ) => {
    const title: string = req.params.title

    try {
      const types: string[] = await fetchJson( '/api/v1', getApiKey() )
      const schema = await getSchema( title, getApiKey() )
      const links = await entityTypesToLinks( types, '/entity', title )
      const nav = AnchorNav( links )

      nav.classList.add( 'seconary-nav' )

      const schemaForm = toForm( schema )

      const content = documentFragment(
        h2( 'Entities' ),
        nav,
        h3( `New ${ startCase( title ) }` ),
        schemaForm
      )

      const postHandler = async e => {
        e.preventDefault()

        const model = getData( <HTMLFormElement>schemaForm )

        const uploadableProperties = uploadablePropertyNames( schema )
        const hasUploadable = uploadableProperties.length > 0

        const uri = `/api/v1/${ title }`
        const poster = hasUploadable ?
          postFormData( uri, model, 'POST', getApiKey() ) :
          postJson( uri, model, 'POST', getApiKey() )

        try {
          const newEntity = await poster

          if( newEntity._meta ){
            message = newEntity._meta.message
          }

          res.redirect( `/entity/${ title }/${ newEntity._id }` )
        } catch ( err ) {
          res.send( ErrorPage( err ) )
        }
      }

      schemaForm.addEventListener( 'submit', postHandler )

      schemaForm.appendChild(
        input( { type: 'submit', id: 'submit-button', value: `Create ${ startCase( title ) }` } )
      )

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch ( err ) {
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title/:id/edit': async ( req, res ) => {
    const title: string = req.params.title
    const id: string = req.params.id

    try {
      const types: string[] = await fetchJson( '/api/v1', getApiKey() )
      const links = await entityTypesToLinks( types, '/entity', title )
      const schema = await getSchema( title, getApiKey() )
      const entity = await fetchJson( `/api/v1/${ title }/${ id }`, getApiKey() )
      const nav = AnchorNav( links )

      nav.classList.add( 'seconary-nav' )

      const entityForm = toForm( schema, title, entity )

      const content = documentFragment(
        h2( 'Entities' ),
        nav,
        h3( `Edit ${ startCase( title ) } ${ id }` ),
        entityForm
      )

      const putHandler = async e => {
        e.preventDefault()

        const uploadableProperties = uploadablePropertyNames( schema )
        const model = getData( <HTMLFormElement>entityForm )
        const hasUploadable = !!uploadableProperties.length

        const uri = `/api/v1/${ title }/${ id }`
        const putter = hasUploadable ?
          putFormData( uri, model, getApiKey() ) :
          putJson( uri, model, getApiKey() )

        try {
          const updatedEntity = await putter

          res.redirect( `/entity/${ title }/${ updatedEntity._id }` )
        } catch ( err ) {
          res.send( ErrorPage( err ) )
        }
      }

      entityForm.addEventListener( 'submit', putHandler )

      entityForm.appendChild(
        input( { type: 'submit', id: 'submit-button', value: `Update ${ startCase( title ) }` } )
      )

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch ( err ) {
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title/:id/delete': async ( req, res ) => {
    const title: string = req.params.title
    const id: string = req.params.id

    try {

      res.redirect( `/entity/${ title }` )
    } catch ( err ) {
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title?/:id?': async ( req, res ) => {
    const title: string | undefined = req.params.title
    const id: string | undefined = req.params.id

    try {
      const types = await fetchJson( '/api/v1', getApiKey() )
      const links = await entityTypesToLinks( types, '/entity', title )
      const nav = AnchorNav( links )

      nav.classList.add( 'seconary-nav' )

      const content = documentFragment(
        h2( 'Entities' ),
        nav
      )

      if ( title ) {
        const ids: string[] = await fetchJson( `/api/v1/${ title }`, getApiKey() )
        const links = await entityIdsForTypeToLinks( ids, '/entity', title, id )
        const nav = AnchorNav( links )

        nav.classList.add( 'tertiary-nav' )

        content.appendChild(
          documentFragment(
            ActionList( [ {
              path: `/entity/${ title }/create`,
              title: `Create new ${ startCase( title ) }`
            } ] ),

            h3( `${ startCase( title ) } Entities` ),

            nav
          )
        )
      }

      if ( id ) {
        const entity = await fetchJson( `/api/v1/${ title }/${ id }`, getApiKey() )
        const message = getMessage()

        content.appendChild(
          documentFragment(
            (
              message ?
              documentFragment(
                h3( 'Message' ),
                p( message )
              ) :
              ''
            ),
            h4( `${ startCase( title ) } ${ id }` ),
            ActionList( [
              {
                title: 'Edit',
                path: `/entity/${ title }/${ id }/edit`
              },
              {
                title: 'Delete',
                path: `/entity/${ title }/${ id }/delete`
              }
            ] ),
            objectToDom( entity )
          )
        )
      }

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch ( err ) {
      res.send( ErrorPage( err ) )
    }
  }
}

export const getData = ( form: HTMLFormElement ) => {
  const entries = getEntries( form, false )
  const pointers = entriesToPointers( entries )

  const map: any = {}

  pointers.forEach( ( [ pointer, value ] ) => {
    // the submit button
    if( pointer === '/' ) return

    map[ pointer ] = value
  } )

  return expand( map )
}