"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_link_item_1 = require("./anchor-link-item");
exports.AppPageTemplate = (deps) => {
    const { h } = deps;
    const { documentFragment, div, nav, ul } = h;
    const AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
    const AppPage = (model = {}, ...childNodes) => {
        const { currentPath = '' } = model;
        const anchorLinkModels = [
            {
                path: '/schema',
                title: 'Schema',
                isCurrent: currentPath.startsWith('/schema')
            },
            {
                path: '/entity',
                title: 'Entities',
                isCurrent: currentPath.startsWith('/entity')
            },
            {
                path: '/files',
                title: 'Files',
                isCurrent: currentPath.startsWith('/files')
            }
        ];
        return documentFragment(nav({ class: 'primary-nav' }, ul(...anchorLinkModels.map(AnchorLinkItem))), div(...childNodes));
    };
    return AppPage;
};
//# sourceMappingURL=app-page.js.map