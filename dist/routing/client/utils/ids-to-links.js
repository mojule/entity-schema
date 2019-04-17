"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_json_1 = require("./fetch-json");
const get_api_key_1 = require("./get-api-key");
const nameMap = new Map();
exports.getSchemaTitle = async (title) => {
    if (!nameMap.has(title)) {
        const result = await fetch_json_1.fetchJson(`/schema/${title}`);
        if (typeof result['name'] === 'string') {
            nameMap.set(title, result['name']);
        }
        else {
            nameMap.set(title, title);
        }
    }
    return nameMap.get(title);
};
exports.getEntityName = async (type, id) => {
    if (!nameMap.has(id)) {
        const result = await fetch_json_1.fetchJson(`/api/v1/${type}/${id}`, get_api_key_1.getApiKey());
        if (typeof result['name'] === 'string') {
            nameMap.set(id, result['name']);
        }
        else {
            nameMap.set(id, id);
        }
    }
    return nameMap.get(id);
};
exports.getSchemaTitles = async (titles) => Promise.all(titles.map(exports.getSchemaTitle));
exports.getEntityNames = async (type, ids) => Promise.all(ids.map(id => exports.getEntityName(type, id)));
exports.schemaNamesToLinks = async (names, current) => {
    const links = [];
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const title = await exports.getSchemaTitle(name);
        const model = {
            title,
            path: 'schema/' + name,
            isCurrent: name === current
        };
        links.push(model);
    }
    return links;
};
exports.entityTypesToLinks = async (types, routePrefix, current) => {
    const names = await exports.getSchemaTitles(types);
    const links = [];
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const title = names[i];
        const path = `${routePrefix}/${type}`;
        const isCurrent = type === current;
        const model = { title, path, isCurrent };
        links.push(model);
    }
    return links;
};
exports.entityIdsForTypeToLinks = async (ids, routePrefix, type, current) => {
    const links = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const title = await exports.getEntityName(type, id);
        const path = `${routePrefix}/${type}/${id}`;
        const isCurrent = id === current;
        const model = { title, path, isCurrent };
        links.push(model);
    }
    return links;
};
//# sourceMappingURL=ids-to-links.js.map