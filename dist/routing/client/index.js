"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const empty_element_1 = require("./utils/empty-element");
const hash_to_path_1 = require("./utils/hash-to-path");
const dom_utils_1 = require("@mojule/dom-utils");
const client_router_1 = require("./routes/client-router");
document.addEventListener('DOMContentLoaded', () => {
    const client = dom_utils_1.strictSelect(document, '.client');
    const send = (node) => {
        empty_element_1.emptyElement(client);
        client.appendChild(node);
    };
    const router = client_router_1.ClientRouter(routes_1.routes, send);
    const navigate = () => {
        const path = hash_to_path_1.hashToPath(location.hash);
        router(path);
    };
    window.addEventListener('hashchange', navigate);
    navigate();
});
//# sourceMappingURL=index.js.map