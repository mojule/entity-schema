"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_utils_1 = require("@mojule/dom-utils");
exports.getApiKey = () => {
    const clientDiv = dom_utils_1.strictSelect(document, '.client');
    const { apiKey } = clientDiv.dataset;
    if (apiKey)
        return 'Basic ' + apiKey;
};
//# sourceMappingURL=get-api-key.js.map