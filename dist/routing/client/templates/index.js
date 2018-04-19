"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_templates_1 = require("../utils/document-templates");
const h = require("../utils/h");
const action_list_1 = require("./action-list");
const anchor_link_item_1 = require("./anchor-link-item");
const app_page_1 = require("./app-page");
const error_page_1 = require("./error-page");
const titles_anchor_nav_1 = require("./titles-anchor-nav");
const documentTemplates = document_templates_1.getDocumentTemplates(document);
const deps = {
    documentTemplates, h
};
exports.ActionList = action_list_1.ActionListTemplate(deps);
exports.AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
exports.AppPage = app_page_1.AppPageTemplate(deps);
exports.ErrorPage = error_page_1.ErrorPageTemplate(deps);
exports.TitlesAnchorNav = titles_anchor_nav_1.TitlesAnchorNavTemplate(deps);
//# sourceMappingURL=index.js.map