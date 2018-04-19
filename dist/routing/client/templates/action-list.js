"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionListTemplate = (deps) => {
    const { h } = deps;
    const { li, button, ul } = h;
    const ActionList = (model) => {
        const actions = model.map(action => {
            const { title, path } = action;
            const type = 'button';
            const click = e => {
                e.preventDefault();
                window.location.href = '#' + path;
            };
            return li(button({ type, click }, title));
        });
        return ul({ class: 'action-list' }, ...actions);
    };
    return ActionList;
};
//# sourceMappingURL=action-list.js.map