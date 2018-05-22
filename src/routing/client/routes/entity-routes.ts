import { fetchJson, postJson, putJson, fetchJsonMultiple, postFormData, putFormData, postDelete } from '../utils/fetch-json'
import { documentFragment, h2, h3, h4, button, input } from '../utils/h'
import { objectToDom } from '../utils/object-to-dom'
import { startCase, kebabCase } from 'lodash'
import { TitlesAnchorNav, ErrorPage, AppPage, ActionList } from '../templates'
import { linkTitlesForSchema } from '../../../link-titles-for-schema'
import { addLinks } from '../../../add-links'
import { IEntitySchema } from '../../../predicates/entity-schema'
import { IClientRouterMap } from './client-router'
import { schemaToForm } from '../../../forms/schema-to-form'
import { schemaFormToEntityModel } from '../../../forms/schema-form-to-entity-model'
import { uploadablePropertyNames } from '../../../uploadable-properties'
import { entityModelToForm } from '../../../forms/entity-model-to-form'

const schemaWithLinks = async schema => {
  const linkTitles = linkTitlesForSchema( schema )

  const fetchJsonMap = linkTitles.reduce( ( map, title ) => {
    map[ title ] = `/api/v1/${ kebabCase( title ) }/all`
    return map
  }, {})

  const linkedEntities = await fetchJsonMultiple( fetchJsonMap )

  const linkMap = Object.keys( linkedEntities ).reduce( ( map, title ) => {
    const entities = linkedEntities[ title ]

    map[ title ] = entities.map( entity => {
      const { _id, name } = entity

      return { _id, name }
    })

    return map
  }, {})

  return addLinks( schema, linkMap )
}

const getSchema = async( title: string ) : Promise<IEntitySchema> => {
  const normalizedSchema: IEntitySchema =  await fetchJson( `/schema/${ title }/normalized` )
  const schema: IEntitySchema = await schemaWithLinks( normalizedSchema )

  return schema
}

export const entityRoutes : IClientRouterMap = {
  '/entity/:title/create': async ( req, res ) => {
    const title: string = req.params.title

    try {
      const titles: string[] = await fetchJson( '/api/v1' )
      const schema = await getSchema( title )

      const entityNav = TitlesAnchorNav({
        routePrefix: '/entity',
        titles,
        currentTitle: title
      })

      const schemaForm = schemaToForm( document, schema )

      const content = documentFragment(
        h2( 'Entities' ),
        TitlesAnchorNav({
          routePrefix: '/entity',
          titles,
          currentTitle: title
        }),
        h3( `New ${ startCase( title ) }` ),
        schemaForm
      )

      const postHandler = async e => {
        e.preventDefault()

        const model = schemaFormToEntityModel( schemaForm )

        const uploadableProperties = uploadablePropertyNames( schema )
        const hasUploadable = uploadableProperties.length > 0

        const uri = `/api/v1/${ title }`
        const poster = hasUploadable ?
          postFormData( uri, model ) :
          postJson( uri, model )

        try {
          const newEntity = await poster

          res.redirect( `/entity/${ title }/${ newEntity._id }` )
        } catch( err ){
          res.send( ErrorPage( err ) )
        }
      }

      schemaForm.addEventListener( 'submit', postHandler )

      schemaForm.appendChild(
        input({ type: 'submit', id: 'submit-button', value: `Create ${ startCase( title ) }` } )
      )

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch( err ){
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title/:id/edit': async ( req, res ) => {
    const title: string = req.params.title
    const id : string = req.params.id

    try {
      const titles: string[] = await fetchJson( '/api/v1' )
      const schema = await getSchema( title )
      const entity = await fetchJson( `/api/v1/${ title }/${ id }` )

      const entityForm = entityModelToForm( document, schema, entity )

      const content = documentFragment(
        h2( 'Entities' ),
        TitlesAnchorNav({
          routePrefix: '/entity',
          titles,
          currentTitle: title
        }),
        h3( `Edit ${ startCase( title ) } ${ id }` ),
        entityForm
      )

      const putHandler = async e => {
        e.preventDefault()

        const uploadableProperties = uploadablePropertyNames( schema )
        const model = schemaFormToEntityModel( entityForm )
        const hasUploadable = !!uploadableProperties.length

        const uri = `/api/v1/${ title }/${ id }`
        const putter = hasUploadable ?
          putFormData( uri, model ) :
          putJson( uri, model )

        try {
          const updatedEntity = await putter

          res.redirect( `/entity/${ title }/${ updatedEntity._id }` )
        } catch( err ){
          res.send( ErrorPage( err ) )
        }
      }

      entityForm.addEventListener( 'submit', putHandler )

      entityForm.appendChild(
        input({ type: 'submit', id: 'submit-button', value: `Update ${ startCase( title ) }` } )
      )

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch( err ){
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title/:id/delete': async ( req, res ) => {
    const title: string = req.params.title
    const id: string = req.params.id

    try {
      const deleted = await postDelete( `/api/v1/${ title }/${ id }` )

      res.redirect( `/entity/${ title }` )
    } catch ( err ) {
      res.send( ErrorPage( err ) )
    }
  },
  '/entity/:title?/:id?': async ( req, res ) => {
    const title : string | undefined = req.params.title
    const id : string | undefined = req.params.id

    try{
      const titles = await fetchJson( '/api/v1' )

      const content = documentFragment(
        h2( 'Entities' ),
        TitlesAnchorNav({
          routePrefix: '/entity',
          titles,
          currentTitle: title
        })
      )

      if( title ){
        const ids: string[] = await fetchJson( `/api/v1/${ title }` )

        content.appendChild(
          documentFragment(
            ActionList([{
              path: `/entity/${ title }/create`,
              title: `Create new ${ startCase( title ) }`
            }]),

            h3( `${ startCase( title ) } IDs` ),

            TitlesAnchorNav({
              routePrefix: `/entity/${ title }`,
              titles: ids,
              currentTitle: id
            })
          )
        )
      }

      if( id ){
        const entity = await fetchJson( `/api/v1/${ title }/${ id }` )

        content.appendChild(
          documentFragment(
            h4( `${ startCase( title ) } ${ id }` ),
            ActionList([
              {
                title: 'Edit',
                path: `/entity/${ title }/${ id }/edit`
              },
              {
                title: 'Delete',
                path: `/entity/${ title }/${ id }/delete`
              }
            ]),
            objectToDom( entity )
          )
        )
      }

      res.send( AppPage( { currentPath: '/entity' }, content ) )
    } catch( err ){
      res.send( ErrorPage( err ) )
    }
  }
}
