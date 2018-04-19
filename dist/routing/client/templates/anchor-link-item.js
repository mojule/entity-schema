"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorLinkItemTemplate = (deps) => {
    const { h } = deps;
    const { li, a } = h;
    const AnchorLinkItem = (model) => {
        const { path, title, isCurrent = false } = model;
        const item = li(a({ href: `#${path}` }, title));
        item.classList.toggle('current', isCurrent);
        return item;
    };
    return AnchorLinkItem;
};
//# sourceMappingURL=anchor-link-item.js.map