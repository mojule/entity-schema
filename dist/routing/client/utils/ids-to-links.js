"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_json_1 = require("./fetch-json");
const get_api_key_1 = require("./get-api-key");
const idToNameMap = new Map();
exports.getName = async (title, id) => {
    if (!idToNameMap.has(id)) {
        const result = await fetch_json_1.fetchJson(`/api/v1/${title}/${id}`, get_api_key_1.getApiKey());
        if (title === 'schema' && typeof result['title'] === 'string') {
            idToNameMap.set(id, result['title']);
        }
        else if (typeof result['name'] === 'string') {
            idToNameMap.set(id, result['name']);
        }
        else {
            idToNameMap.set(id, id);
        }
    }
    return idToNameMap.get(id);
};
exports.idsToLinks = async (ids, routePrefix, current) => {
    const links = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const name = await exports.getName(routePrefix, id);
        const model = {
            title: name,
            path: routePrefix + '/' + id,
            isCurrent: id === current
        };
        links.push(model);
    }
    return links;
};
//# sourceMappingURL=ids-to-links.js.map