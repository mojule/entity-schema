import * as h from '../utils/h'
import { AdminTemplateDeps } from './types'

import {
  ActionListTemplate, ActionModel
} from './action-list'

import {
  AnchorLinkItemTemplate, AnchorLinkItemModel
} from './anchor-link-item'

import {
  AppPageTemplate, AppPageModel
} from './app-page'

import { ErrorPageTemplate } from './error-page'

import {
  AnchorNavTemplate
} from './anchor-nav'

const deps: AdminTemplateDeps = { h }

export const ActionList = ActionListTemplate( deps )
export const AnchorLinkItem = AnchorLinkItemTemplate( deps )
export const AppPage = AppPageTemplate( deps )
export const ErrorPage = ErrorPageTemplate( deps )
export const AnchorNav = AnchorNavTemplate( deps )
