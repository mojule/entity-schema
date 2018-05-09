"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_link_item_1 = require("./anchor-link-item");
exports.AppPageTemplate = (deps) => {
    const { h } = deps;
    const { documentFragment, div, nav, ul } = h;
    const AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
    const AppPage = (model = {}, ...childNodes) => {
        const { currentPath = '' } = model;
        const navList = nav(ul());
        const main = div();
        const dom = documentFragment(navList, main);
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