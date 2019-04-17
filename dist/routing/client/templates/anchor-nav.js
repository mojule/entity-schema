"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_link_item_1 = require("./anchor-link-item");
exports.AnchorNavTemplate = (deps) => {
    const { h } = deps;
    const { nav, ul } = h;
    const AnchorLinkItem = anchor_link_item_1.AnchorLinkItemTemplate(deps);
    const AnchorNav = (model) => {
        const anchorLinks = model.map(AnchorLinkItem);
        const anchorNav = nav(ul(...anchorLinks));
        return anchorNav;
    };
    return AnchorNav;
};
//# sourceMappingURL=anchor-nav.js.map