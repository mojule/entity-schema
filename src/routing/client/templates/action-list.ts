import { AdminTemplateDeps } from './types'

export interface ActionModel {
  title: string
  path: string
}

export const ActionListTemplate = ( deps: AdminTemplateDeps ) => {
  const { h } = deps
  const { li, button, ul } = h

  const ActionList = ( model: ActionModel[] ) => {
    const actions = model.map( action => {
      const { title, path } = action
      const type = 'button'

      const click = e => {
        e.preventDefault()
        window.location.href = '#' + path
      }


      return li( button( { type, click }, title ) )
    })

    return ul( { class: 'action-list' }, ...actions )
  }

  return ActionList
}
