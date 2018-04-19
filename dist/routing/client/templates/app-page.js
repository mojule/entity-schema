"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_link_item_1 = require("./anchor-link-item");
const dom_utils_1 = require("@mojule/dom-utils");
exports.AppPageTemplate = (deps) => {
    const { documentTemplates } = deps;
    const { page } = documentTemplates;
    const AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
    const AppPage = (model = {}, ...childNodes) => {
        const { currentPath = '' } = model;
        const dom = page();
        const main = dom_utils_1.strictSelect(dom, 'main');
        const navList = dom_utils_1.strictSelect(dom, 'nav ul');
        childNodes.forEach(childNode => {
            main.appendChild(childNode);
        });
        const anchorLinkModels = [
            { path: '/schema', title: 'Schema', isCurrent: currentPath === '/schema' },
            { path: '/entity', title: 'Entities', isCurrent: currentPath === '/entity' }
        ];
        anchorLinkModels.forEach(model => {
            const anchorLink = AnchorLinkItem(model);
            navList.appendChild(anchorLink);
        });
        return dom;
    };
    return AppPage;
};
//# sourceMappingURL=app-page.js.map