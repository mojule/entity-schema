import { getDocumentTemplates } from '../utils/document-templates'
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
  TitlesAnchorNavTemplate, TitlesAnchorNavModel
} from './titles-anchor-nav'

const documentTemplates = getDocumentTemplates( document )

const deps: AdminTemplateDeps = {
  documentTemplates, h
}

export const ActionList = ActionListTemplate( deps )
export const AnchorLinkItem = AnchorLinkItemTemplate( deps )
export const AppPage = AppPageTemplate( deps )
export const ErrorPage = ErrorPageTemplate( deps )
export const TitlesAnchorNav = TitlesAnchorNavTemplate( deps )
