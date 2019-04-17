"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const templates_1 = require("../templates");
const fetch_json_1 = require("../utils/fetch-json");
const h_1 = require("../utils/h");
const object_to_dom_1 = require("../utils/object-to-dom");
const get_api_key_1 = require("../utils/get-api-key");
const ids_to_links_1 = require("../utils/ids-to-links");
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
exports.schemaRoutes = {
    '/schema/:title?/:mode?': async (req, res) => {
        const title = req.params.title;
        const mode = req.params.mode;
        try {
            const titles = await fetch_json_1.fetchJson('/schema', get_api_key_1.getApiKey());
            const schema = title ?
                mode === 'normalized' ?
                    await fetch_json_1.fetchJson(`/schema/${title}/normalized`, get_api_key_1.getApiKey()) :
                    await fetch_json_1.fetchJson(`/schema/${title}`, get_api_key_1.getApiKey()) :
                undefined;
            const links = await ids_to_links_1.schemaNamesToLinks(titles, title);
            const schemaNav = templates_1.AnchorNav(links);
            schemaNav.classList.add('secondary-nav');
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