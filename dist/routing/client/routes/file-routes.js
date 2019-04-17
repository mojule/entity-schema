"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const h_1 = require("../utils/h");
const templates_1 = require("../templates");
const fetch_json_1 = require("../utils/fetch-json");
const dom_utils_1 = require("@mojule/dom-utils");
const ids_to_links_1 = require("../utils/ids-to-links");
exports.FileRoutes = (resolverNames) => {
    const ids = ['disk-file', 'image-file', 'zip-file'];
    return {
        '/files': async (_req, res) => {
            const links = await ids_to_links_1.idsToLinks(ids, '/files');
            const filesNav = templates_1.TitlesAnchorNav(links);
            const content = h_1.documentFragment(h_1.h2('Files'), filesNav);
            res.send(templates_1.AppPage({ currentPath: '/files' }, content));
        },
        '/files/disk-file': async (_req, res) => {
            const formEl = h_1.form({
                action: '/api/v1/files/create',
                method: 'post',
                enctype: 'multipart/form-data'
            }, h_1.input({
                type: 'file',
                name: 'createFile'
            }), h_1.input({
                type: 'submit',
                value: 'Create File'
            }));
            const links = await ids_to_links_1.idsToLinks(ids, '/files', 'disk-file');
            const filesNav = templates_1.TitlesAnchorNav(links);
            const content = h_1.documentFragment(h_1.h2('Files'), filesNav, h_1.h3('Upload File'), formEl);
            formEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const newEntity = await fetch_json_1.sendFile('/api/v1/files/create', formEl, 'POST');
                    if (newEntity.filePaths) {
                        window.location.hash = `#/entity/zip-file/${newEntity._id}`;
                    }
                    else if (newEntity.meta.width) {
                        window.location.hash = `#/entity/image-file/${newEntity._id}`;
                    }
                    else {
                        window.location.hash = `#/entity/disk-file/${newEntity._id}`;
                    }
                }
                catch (err) {
                    res.send(templates_1.ErrorPage(err));
                }
            });
            res.send(templates_1.AppPage({ currentPath: '/files' }, content));
        },
        '/files/image-file': async (_req, res) => {
            const formEl = h_1.form({
                action: '/api/v1/files/create',
                method: 'post',
                enctype: 'multipart/form-data'
            }, h_1.input({
                type: 'file',
                name: 'createFile'
            }), h_1.input({
                type: 'submit',
                value: 'Create File'
            }));
            const links = await ids_to_links_1.idsToLinks(ids, '/files', 'image-file');
            const filesNav = templates_1.TitlesAnchorNav(links);
            const content = h_1.documentFragment(h_1.h2('Files'), filesNav, h_1.h3('Upload Image File'), formEl);
            formEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const newEntity = await fetch_json_1.sendFile('/api/v1/files/create', formEl, 'POST');
                    if (newEntity.filePaths) {
                        window.location.hash = `#/entity/zip-file/${newEntity._id}`;
                    }
                    else if (newEntity.meta.width) {
                        window.location.hash = `#/entity/image-file/${newEntity._id}`;
                    }
                    else {
                        window.location.hash = `#/entity/disk-file/${newEntity._id}`;
                    }
                }
                catch (err) {
                    res.send(templates_1.ErrorPage(err));
                }
            });
            res.send(templates_1.AppPage({ currentPath: '/files' }, content));
        },
        '/files/zip-file': async (_req, res) => {
            const formEl = h_1.form({
                action: '/api/v1/files/create',
                method: 'post',
                enctype: 'multipart/form-data'
            }, h_1.input({
                type: 'file',
                name: 'createFile'
            }), h_1.label('Zip Type', h_1.select({ name: 'resolver' }, ...resolverNames.map(name => h_1.option(name)), h_1.option('None'))), h_1.input({
                type: 'submit',
                value: 'Create File'
            }));
            const links = await ids_to_links_1.idsToLinks(ids, '/files', 'zip-file');
            const filesNav = templates_1.TitlesAnchorNav(links);
            const content = h_1.documentFragment(h_1.h2('Files'), filesNav, h_1.h3('Upload Zip File'), formEl);
            formEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const resolverEl = dom_utils_1.strictSelect(formEl, 'select[name="resolver"]');
                    const resolver = resolverEl.options[resolverEl.selectedIndex].text;
                    const resolverSlug = resolver === 'None' ? '' : `/${resolver}`;
                    const newEntity = await fetch_json_1.sendFile(`/api/v1/files/create${resolverSlug}`, formEl, 'POST');
                    if (newEntity.filePaths) {
                        window.location.hash = `#/entity/zip-file/${newEntity._id}`;
                    }
                    else if (newEntity.meta.width) {
                        window.location.hash = `#/entity/image-file/${newEntity._id}`;
                    }
                    else {
                        window.location.hash = `#/entity/disk-file/${newEntity._id}`;
                    }
                }
                catch (err) {
                    res.send(templates_1.ErrorPage(err));
                }
            });
            res.send(templates_1.AppPage({ currentPath: '/files' }, content));
        }
    };
};
exports.fileRoutes = exports.FileRoutes([]);
//# sourceMappingURL=file-routes.js.map