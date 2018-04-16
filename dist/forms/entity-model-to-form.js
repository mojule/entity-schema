"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_pointer_1 = require("@mojule/json-pointer");
const is_1 = require("@mojule/is");
const schema_to_form_1 = require("./schema-to-form");
const filter_entity_by_schema_1 = require("../filter-entity-by-schema");
const subschema_map_1 = require("../subschema-map");
const dom_utils_1 = require("@mojule/dom-utils");
const arrays_in_path_1 = require("../utils/arrays-in-path");
exports.entityModelToForm = (document, schema, model) => {
    const schemaFormEl = schema_to_form_1.schemaToForm(document, schema);
    model = filter_entity_by_schema_1.filterEntityBySchema(model, schema);
    const jsonPointerMap = json_pointer_1.flatten(model);
    const schemaPathMap = subschema_map_1.subschemaMap(schema);
    const oneOfSchema = {};
    Object.keys(schemaPathMap).forEach(schemaPath => {
        const subSchema = schemaPathMap[schemaPath];
        if ('oneOf' in subSchema) {
            const options = subSchema.oneOf;
            const title = jsonPointerMap[schemaPath + '/kind'];
            const index = options.findIndex(schema => schema.properties.kind.default === title);
            oneOfSchema[schemaPath] = {
                title, index
            };
        }
    });
    Object.keys(oneOfSchema).forEach(schemaPath => {
        const { index } = oneOfSchema[schemaPath];
        delete jsonPointerMap[schemaPath + '/kind'];
        Object.keys(jsonPointerMap).forEach(jsonPointerPath => {
            if (!jsonPointerPath.startsWith(schemaPath))
                return;
            const newPath = jsonPointerPath.replace(schemaPath, schemaPath + '/?' + index);
            jsonPointerMap[newPath] = jsonPointerMap[jsonPointerPath];
            delete jsonPointerMap[jsonPointerPath];
        });
        jsonPointerMap[schemaPath + '/?'] = index;
    });
    const arrayifyApi = schemaFormEl[schema_to_form_1.ArrayifySymbol];
    const oneOfApi = schemaFormEl[schema_to_form_1.OneOfSymbol];
    const arrayInfo = arrays_in_path_1.arrayPointerInfo(jsonPointerMap);
    Object.keys(arrayInfo).forEach(arrayPointerPath => {
        const length = arrayInfo[arrayPointerPath];
        for (let i = 0; i < length; i++) {
            arrayifyApi[arrayPointerPath].add();
        }
    });
    Object.keys(jsonPointerMap).forEach(jsonPointerPath => {
        const value = jsonPointerMap[jsonPointerPath];
        // an empty array - nothing to populate - if it has any children, they will
        // also exists with json pointer paths, so fine to skip it here.
        if (is_1.is.array(value))
            return;
        if (jsonPointerPath.endsWith('?')) {
            const radios = Array.from(schemaFormEl.querySelectorAll(`input[name="${jsonPointerPath}"]`));
            radios.forEach(radio => {
                radio.checked = radio.value === String(value);
            });
            oneOfApi[jsonPointerPath].toggle();
            return;
        }
        const editor = dom_utils_1.strictSelect(schemaFormEl, `[name="${jsonPointerPath}"]`);
        if (editor.type === 'checkbox') {
            editor.checked = value;
        }
        else if (editor.type === 'file') {
            const pathEditor = dom_utils_1.strictSelect(schemaFormEl, `[type="text"][name="${editor.name}"]`);
            pathEditor.value = value;
        }
        else if (editor.localName === 'select') {
            const optionEl = dom_utils_1.strictSelect(editor, `[value="${value}"]`);
            optionEl.setAttribute('selected', '');
        }
        else {
            editor.value = value;
        }
    });
    return schemaFormEl;
};
//# sourceMappingURL=entity-model-to-form.js.map