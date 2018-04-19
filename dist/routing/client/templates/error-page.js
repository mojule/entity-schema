"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_page_1 = require("./app-page");
exports.ErrorPageTemplate = (deps) => {
    const { h } = deps;
    const { documentFragment, h2, p, h3, pre } = h;
    const AppPage = app_page_1.AppPageTemplate(deps);
    const ErrorPage = (model) => {
        return AppPage({}, h2('Error'), h3(model.name), pre(model.message), pre(model.stack || ''));
    };
    return ErrorPage;
};
//# sourceMappingURL=error-page.js.map