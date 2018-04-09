"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_pointer_1 = require("@mojule/json-pointer");
const is_1 = require("@mojule/is");
const resolveOneOf = jsonPointerToValueMap => {
    const keys = Object.keys(jsonPointerToValueMap);
    const discriminators = keys.filter(key => key.endsWith('?'));
    discriminators.forEach(discriminatorKey => {
        const value = jsonPointerToValueMap[discriminatorKey];
        const targetKey = discriminatorKey + value;
        keys.forEach(key => {
            if (!key.startsWith(discriminatorKey))
                return;
            // if it's a match, copy to a new key without the oneOf markers
            if (key.startsWith(targetKey)) {
                // remove the trailing ?
                const newPathStart = discriminatorKey.slice(0, -1);
                // the old oneOf path
                const find = targetKey + '/';
                // new path without oneOf marker
                const newKey = key.replace(find, newPathStart);
                jsonPointerToValueMap[newKey] = jsonPointerToValueMap[key];
            }
            // delete all oneOf keys
            delete jsonPointerToValueMap[key];
        });
    });
};
exports.schemaFormToEntityModel = (formEl) => {
    const editors = Array.from(formEl.querySelectorAll('input, textarea, select'));
    const arraySubSchemaEls = Array.from(formEl.querySelectorAll('[data-schema][data-type="array"]'));
    const arraySubschemaPaths = arraySubSchemaEls.map(el => `/${el.dataset.path}`);
    const jsonPointerToValueMap = {};
    editors.forEach(editor => {
        const { name, type } = editor;
        if (type === 'submit')
            return;
        let value = editor.value;
        if (type === 'file') {
            const input = editor;
            if (input.files && input.files[0]) {
                value = input.files[0];
            }
        }
        else if (type === 'checkbox') {
            value = editor.checked;
        }
        else if (type === 'hidden' && editor.dataset.type === 'boolean') {
            value = value === 'true';
        }
        else if (type === 'radio') {
            if (!editor.checked) {
                return;
            }
        }
        if (is_1.is.string(value)) {
            value = value.trim();
        }
        /*
          form fields not filled out always return empty string - if not a required
          field then we shouldn't add those empty strings to the model, because if
          we do, JSON schema validation will fail as it thinks we have provided a
          value for that field
        */
        if (!editor.required && value === '')
            return;
        jsonPointerToValueMap[name] = value;
    });
    const jsonPaths = Object.keys(jsonPointerToValueMap);
    // ensure empty arrays
    arraySubschemaPaths.forEach(arrayPath => {
        if (!jsonPaths.some(p => p.startsWith(arrayPath))) {
            jsonPointerToValueMap[arrayPath] = [];
        }
    });
    resolveOneOf(jsonPointerToValueMap);
    return json_pointer_1.expand(jsonPointerToValueMap);
};
//# sourceMappingURL=schema-form-to-entity-model.js.map