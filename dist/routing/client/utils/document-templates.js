"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentTemplates = (document) => {
    const templates = Array.from(document.querySelectorAll('template[id]'));
    const documentTemplates = templates.reduce((map, template) => {
        map[template.id] = () => template.content.cloneNode(true);
        return map;
    }, {});
    return documentTemplates;
};
exports.documentTemplates = exports.getDocumentTemplates(document);
//# sourceMappingURL=document-templates.js.map