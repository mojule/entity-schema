"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_pointer_1 = require("@mojule/json-pointer");
const jsonOrError = async (res) => {
    const result = await res.json();
    if (res.ok) {
        return result;
    }
    const message = result ? JSON.stringify(result, null, 2) : '';
    throw Error(`Error ${res.status} fetching JSON\n${res.statusText}\n${message}`);
};
exports.fetchJson = uri => fetch(uri).then(jsonOrError);
exports.fetchJsonMultiple = (map) => {
    const result = {};
    const propertyNames = Object.keys(map);
    return Promise.all(propertyNames.map(propertyName => {
        const uri = map[propertyName];
        return exports.fetchJson(uri).then(obj => {
            result[propertyName] = obj;
        });
    })).then(() => result);
};
exports.postDelete = (uri) => fetch(uri, {
    method: 'DELETE',
    headers: new Headers({
        'Content-Type': 'application/json'
    })
})
    .then(jsonOrError);
const sendJson = (uri, model, method = 'POST') => fetch(uri, {
    method,
    body: JSON.stringify(model),
    headers: new Headers({
        'Content-Type': 'application/json'
    })
})
    .then(jsonOrError);
exports.postJson = sendJson;
exports.putJson = (uri, model) => sendJson(uri, model, 'PUT');
const sendFormData = (uri, model, method = 'POST') => {
    const formData = new FormData();
    const { _files } = model;
    delete model['_files'];
    const flat = json_pointer_1.flatten(model);
    Object.keys(flat).forEach(pointer => {
        formData.append(pointer, JSON.stringify(flat[pointer]));
    });
    if (_files) {
        Object.keys(_files).forEach(pointer => {
            formData.append(pointer, _files[pointer]);
        });
    }
    return fetch(uri, {
        method,
        body: formData
    })
        .then(jsonOrError);
};
exports.postFormData = sendFormData;
exports.putFormData = (uri, model) => sendFormData(uri, model, 'PUT');
//# sourceMappingURL=fetch-json.js.map