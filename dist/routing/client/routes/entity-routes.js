"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_json_1 = require("../utils/fetch-json");
const h_1 = require("../utils/h");
const object_to_dom_1 = require("../utils/object-to-dom");
const lodash_1 = require("lodash");
const templates_1 = require("../templates");
const link_titles_for_schema_1 = require("../../../link-titles-for-schema");
const add_links_1 = require("../../../add-links");
const uploadable_properties_1 = require("../../../uploadable-properties");
const is_1 = require("@mojule/is");
const schema_forms_1 = require("@mojule/schema-forms");
const json_pointer_1 = require("@mojule/json-pointer");
const get_api_key_1 = require("../utils/get-api-key");
const ids_to_links_1 = require("../utils/ids-to-links");
const templates = schema_forms_1.ClientFormTemplates(document, Event);
const toFormElements = schema_forms_1.SchemaToFormElements(templates);
const toForm = (schema, name, value) => h_1.form(toFormElements(schema, name, value));
const schemaWithLinks = async (schema, authorize) => {
    const linkTitles = link_titles_for_schema_1.linkTitlesForSchema(schema);
    const fetchJsonMap = linkTitles.reduce((map, title) => {
        map[title] = `/api/v1/${lodash_1.kebabCase(title)}/all`;
        return map;
    }, {});
    const linkedEntities = await fetch_json_1.fetchJsonMultiple(fetchJsonMap, authorize);
    const linkMap = Object.keys(linkedEntities).reduce((map, title) => {
        const entities = linkedEntities[title];
        map[title] = entities.map(entity => {
            const { _id, name } = entity;
            return { _id, name };
        });
        return map;
    }, {});
    return add_links_1.addLinks(schema, linkMap);
};
const getSchema = async (title, authorize) => {
    const normalizedSchema = await fetch_json_1.fetchJson(`/schema/${title}/normalized`, authorize);
    const schema = await schemaWithLinks(normalizedSchema, authorize);
    return schema;
};
let message = null;
// destructive! allows for one-time messages
const getMessage = () => {
    if (is_1.is.string(message)) {
        const result = message;
        message = null;
        return result;
    }
};
exports.entityRoutes = {
    '/entity/:title/create': async (req, res) => {
        const title = req.params.title;
        try {
            const ids = await fetch_json_1.fetchJson('/api/v1', get_api_key_1.getApiKey());
            const schema = await getSchema(title, get_api_key_1.getApiKey());
            const links = await ids_to_links_1.idsToLinks(ids, '/entity', title);
            const schemaForm = toForm(schema);
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav(links), h_1.h3(`New ${lodash_1.startCase(title)}`), schemaForm);
            const postHandler = async (e) => {
                e.preventDefault();
                const model = exports.getData(schemaForm);
                const uploadableProperties = uploadable_properties_1.uploadablePropertyNames(schema);
                const hasUploadable = uploadableProperties.length > 0;
                const uri = `/api/v1/${title}`;
                const poster = hasUploadable ?
                    fetch_json_1.postFormData(uri, model, 'POST', get_api_key_1.getApiKey()) :
                    fetch_json_1.postJson(uri, model, 'POST', get_api_key_1.getApiKey());
                try {
                    const newEntity = await poster;
                    if (newEntity._meta) {
                        message = newEntity._meta.message;
                    }
                    res.redirect(`/entity/${title}/${newEntity._id}`);
                }
                catch (err) {
                    res.send(templates_1.ErrorPage(err));
                }
            };
            schemaForm.addEventListener('submit', postHandler);
            schemaForm.appendChild(h_1.input({ type: 'submit', id: 'submit-button', value: `Create ${lodash_1.startCase(title)}` }));
            res.send(templates_1.AppPage({ currentPath: '/entity' }, content));
        }
        catch (err) {
            res.send(templates_1.ErrorPage(err));
        }
    },
    '/entity/:title/:id/edit': async (req, res) => {
        const title = req.params.title;
        const id = req.params.id;
        try {
            const ids = await fetch_json_1.fetchJson('/api/v1', get_api_key_1.getApiKey());
            const links = await ids_to_links_1.idsToLinks(ids, '/entity', title);
            const schema = await getSchema(title, get_api_key_1.getApiKey());
            const entity = await fetch_json_1.fetchJson(`/api/v1/${title}/${id}`, get_api_key_1.getApiKey());
            const entityForm = toForm(schema, title, entity);
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav(links), h_1.h3(`Edit ${lodash_1.startCase(title)} ${id}`), entityForm);
            const putHandler = async (e) => {
                e.preventDefault();
                const uploadableProperties = uploadable_properties_1.uploadablePropertyNames(schema);
                const model = exports.getData(entityForm);
                const hasUploadable = !!uploadableProperties.length;
                const uri = `/api/v1/${title}/${id}`;
                const putter = hasUploadable ?
                    fetch_json_1.putFormData(uri, model, get_api_key_1.getApiKey()) :
                    fetch_json_1.putJson(uri, model, get_api_key_1.getApiKey());
                try {
                    const updatedEntity = await putter;
                    res.redirect(`/entity/${title}/${updatedEntity._id}`);
                }
                catch (err) {
                    res.send(templates_1.ErrorPage(err));
                }
            };
            entityForm.addEventListener('submit', putHandler);
            entityForm.appendChild(h_1.input({ type: 'submit', id: 'submit-button', value: `Update ${lodash_1.startCase(title)}` }));
            res.send(templates_1.AppPage({ currentPath: '/entity' }, content));
        }
        catch (err) {
            res.send(templates_1.ErrorPage(err));
        }
    },
    '/entity/:title/:id/delete': async (req, res) => {
        const title = req.params.title;
        const id = req.params.id;
        try {
            res.redirect(`/entity/${title}`);
        }
        catch (err) {
            res.send(templates_1.ErrorPage(err));
        }
    },
    '/entity/:title?/:id?': async (req, res) => {
        const title = req.params.title;
        const id = req.params.id;
        try {
            const entityNames = await fetch_json_1.fetchJson('/api/v1', get_api_key_1.getApiKey());
            const links = await ids_to_links_1.idsToLinks(entityNames, '/entity', title);
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav(links));
            if (title) {
                const ids = await fetch_json_1.fetchJson(`/api/v1/${title}`, get_api_key_1.getApiKey());
                const links = await ids_to_links_1.idsToLinks(ids, `/entity/${title}`, id);
                content.appendChild(h_1.documentFragment(templates_1.ActionList([{
                        path: `/entity/${title}/create`,
                        title: `Create new ${lodash_1.startCase(title)}`
                    }]), h_1.h3(`${lodash_1.startCase(title)} IDs`), templates_1.TitlesAnchorNav(links)));
            }
            if (id) {
                const entity = await fetch_json_1.fetchJson(`/api/v1/${title}/${id}`, get_api_key_1.getApiKey());
                const message = getMessage();
                content.appendChild(h_1.documentFragment((message ?
                    h_1.documentFragment(h_1.h3('Message'), h_1.p(message)) :
                    ''), h_1.h4(`${lodash_1.startCase(title)} ${id}`), templates_1.ActionList([
                    {
                        title: 'Edit',
                        path: `/entity/${title}/${id}/edit`
                    },
                    {
                        title: 'Delete',
                        path: `/entity/${title}/${id}/delete`
                    }
                ]), object_to_dom_1.objectToDom(entity)));
            }
            res.send(templates_1.AppPage({ currentPath: '/entity' }, content));
        }
        catch (err) {
            res.send(templates_1.ErrorPage(err));
        }
    }
};
exports.getData = (form) => {
    const entries = schema_forms_1.getEntries(form, false);
    const pointers = schema_forms_1.entriesToPointers(entries);
    const map = {};
    pointers.forEach(([pointer, value]) => {
        // the submit button
        if (pointer === '/')
            return;
        map[pointer] = value;
    });
    return json_pointer_1.expand(map);
};
//# sourceMappingURL=entity-routes.js.map