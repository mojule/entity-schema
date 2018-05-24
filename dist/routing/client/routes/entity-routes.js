"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_json_1 = require("../utils/fetch-json");
const h_1 = require("../utils/h");
const object_to_dom_1 = require("../utils/object-to-dom");
const lodash_1 = require("lodash");
const templates_1 = require("../templates");
const link_titles_for_schema_1 = require("../../../link-titles-for-schema");
const add_links_1 = require("../../../add-links");
const schema_to_form_1 = require("../../../forms/schema-to-form");
const schema_form_to_entity_model_1 = require("../../../forms/schema-form-to-entity-model");
const uploadable_properties_1 = require("../../../uploadable-properties");
const entity_model_to_form_1 = require("../../../forms/entity-model-to-form");
const dom_utils_1 = require("@mojule/dom-utils");
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
const getApiKey = () => {
    const clientDiv = dom_utils_1.strictSelect(document, '.client');
    const { apiKey } = clientDiv.dataset;
    if (apiKey)
        return 'Basic ' + apiKey;
};
exports.entityRoutes = {
    '/entity/:title/create': async (req, res) => {
        const title = req.params.title;
        try {
            const titles = await fetch_json_1.fetchJson('/api/v1', getApiKey());
            const schema = await getSchema(title, getApiKey());
            const entityNav = templates_1.TitlesAnchorNav({
                routePrefix: '/entity',
                titles,
                currentTitle: title
            });
            const schemaForm = schema_to_form_1.schemaToForm(document, schema);
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav({
                routePrefix: '/entity',
                titles,
                currentTitle: title
            }), h_1.h3(`New ${lodash_1.startCase(title)}`), schemaForm);
            const postHandler = async (e) => {
                e.preventDefault();
                const model = schema_form_to_entity_model_1.schemaFormToEntityModel(schemaForm);
                const uploadableProperties = uploadable_properties_1.uploadablePropertyNames(schema);
                const hasUploadable = uploadableProperties.length > 0;
                const uri = `/api/v1/${title}`;
                const poster = hasUploadable ?
                    fetch_json_1.postFormData(uri, model, 'POST', getApiKey()) :
                    fetch_json_1.postJson(uri, model, 'POST', getApiKey());
                try {
                    const newEntity = await poster;
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
            const titles = await fetch_json_1.fetchJson('/api/v1', getApiKey());
            const schema = await getSchema(title, getApiKey());
            const entity = await fetch_json_1.fetchJson(`/api/v1/${title}/${id}`, getApiKey());
            const entityForm = entity_model_to_form_1.entityModelToForm(document, schema, entity);
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav({
                routePrefix: '/entity',
                titles,
                currentTitle: title
            }), h_1.h3(`Edit ${lodash_1.startCase(title)} ${id}`), entityForm);
            const putHandler = async (e) => {
                e.preventDefault();
                const uploadableProperties = uploadable_properties_1.uploadablePropertyNames(schema);
                const model = schema_form_to_entity_model_1.schemaFormToEntityModel(entityForm);
                const hasUploadable = !!uploadableProperties.length;
                const uri = `/api/v1/${title}/${id}`;
                const putter = hasUploadable ?
                    fetch_json_1.putFormData(uri, model, getApiKey()) :
                    fetch_json_1.putJson(uri, model, getApiKey());
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
            const deleted = await fetch_json_1.postDelete(`/api/v1/${title}/${id}`, getApiKey());
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
            const titles = await fetch_json_1.fetchJson('/api/v1', getApiKey());
            const content = h_1.documentFragment(h_1.h2('Entities'), templates_1.TitlesAnchorNav({
                routePrefix: '/entity',
                titles,
                currentTitle: title
            }));
            if (title) {
                const ids = await fetch_json_1.fetchJson(`/api/v1/${title}`, getApiKey());
                content.appendChild(h_1.documentFragment(templates_1.ActionList([{
                        path: `/entity/${title}/create`,
                        title: `Create new ${lodash_1.startCase(title)}`
                    }]), h_1.h3(`${lodash_1.startCase(title)} IDs`), templates_1.TitlesAnchorNav({
                    routePrefix: `/entity/${title}`,
                    titles: ids,
                    currentTitle: id
                })));
            }
            if (id) {
                const entity = await fetch_json_1.fetchJson(`/api/v1/${title}/${id}`, getApiKey());
                content.appendChild(h_1.documentFragment(h_1.h4(`${lodash_1.startCase(title)} ${id}`), templates_1.ActionList([
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
//# sourceMappingURL=entity-routes.js.map