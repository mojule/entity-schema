"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const templates_1 = require("../templates");
const fetch_json_1 = require("../utils/fetch-json");
const h_1 = require("../utils/h");
const object_to_dom_1 = require("../utils/object-to-dom");
const dom_utils_1 = require("@mojule/dom-utils");
const linkifySchemaDom = (schemaDom) => {
    const $refs = schemaDom.querySelectorAll('td[data-name="$ref"]');
    for (let td of $refs) {
        const uri = td.dataset.value;
        const url = new URL(uri);
        const path = url.pathname;
        const link = document.createElement('a');
        link.href = '#' + path;
        while (td.firstChild)
            link.appendChild(td.firstChild);
        td.appendChild(link);
    }
};
const getApiKey = () => {
    const clientDiv = dom_utils_1.strictSelect(document, '.client');
    const { apiKey } = clientDiv.dataset;
    if (apiKey)
        return 'Basic ' + apiKey;
};
exports.schemaRoutes = {
    '/schema/:title?/:mode?': async (req, res) => {
        const title = req.params.title;
        const mode = req.params.mode;
        try {
            const titles = await fetch_json_1.fetchJson('/schema', getApiKey());
            const schema = title ?
                mode === 'normalized' ?
                    await fetch_json_1.fetchJson(`/schema/${title}/normalized`, getApiKey()) :
                    await fetch_json_1.fetchJson(`/schema/${title}`, getApiKey()) :
                undefined;
            const schemaNav = templates_1.TitlesAnchorNav({
                routePrefix: '/schema',
                titles,
                currentTitle: title
            });
            const content = h_1.documentFragment(h_1.h2('Schemas'), schemaNav);
            if (schema && title) {
                const schemaDom = object_to_dom_1.objectToDom(schema);
                linkifySchemaDom(schemaDom);
                content.appendChild(h_1.h3(lodash_1.startCase(title)));
                if (mode !== 'normalized') {
                    content.appendChild(templates_1.ActionList([{
                            title: 'Resolve $refs',
                            path: req.path + '/normalized'
                        }]));
                }
                content.appendChild(schemaDom);
            }
            res.send(templates_1.AppPage({ currentPath: '/schema' }, content));
        }
        catch (err) {
            res.send(templates_1.ErrorPage(err));
        }
    }
};
//# sourceMappingURL=schema-routes.js.map