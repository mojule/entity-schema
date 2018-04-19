"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_link_item_1 = require("./anchor-link-item");
exports.TitlesAnchorNavTemplate = (deps) => {
    const { h } = deps;
    const { nav, ul } = h;
    const AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
    const TitlesAnchorNav = (model) => {
        const { routePrefix = '', titles = [], currentTitle = '' } = model;
        const anchorLinks = titles.map(title => {
            const path = routePrefix + '/' + title;
            const isCurrent = title === currentTitle;
            return AnchorLinkItem({ path, title, isCurrent });
        });
        const anchorNav = nav(ul(...anchorLinks));
        return anchorNav;
    };
    return TitlesAnchorNav;
};
//# sourceMappingURL=titles-anchor-nav.js.map