"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_to_form_1 = require("./schema-to-form");
const dom_utils_1 = require("@mojule/dom-utils");
const arrayify = (arrayEl, h) => {
    const { button } = h;
    const path = dom_utils_1.strictGetAttribute(arrayEl, 'data-path');
    const arrayFieldset = dom_utils_1.strictSelect(arrayEl, 'fieldset');
    // we are using [] as a convention to name the item subschema of an array schema
    const arrayItemEl = dom_utils_1.strictSelect(arrayEl, `[data-array="${path}"]`);
    const arrayItemList = dom_utils_1.strictSelect(arrayEl, 'ol');
    const arrayItemWrapper = arrayItemEl.parentNode;
    arrayItemList.removeChild(arrayItemWrapper);
    const createNewArrayItem = () => {
        const newItem = arrayItemWrapper.cloneNode(true);
        const remove = () => {
            arrayItemList.removeChild(newItem);
            reindex();
        };
        newItem.appendChild(button({ type: 'button', click: remove, data: { action: 'remove', array: path } }, 'Remove'));
        return newItem;
    };
    const reindex = () => {
        const listSchemaItems = Array.from(arrayItemList.querySelectorAll(`[data-schema][data-array="${path}"]`));
        listSchemaItems.forEach((item, index) => {
            item.setAttribute('data-path', `${path}/${index}`);
            const labelEl = dom_utils_1.strictSelect(item, 'label');
            labelEl.setAttribute('for', `/${path}/${index}`);
            const inputEl = dom_utils_1.strictSelect(item, 'input');
            inputEl.setAttribute('id', `/${path}/${index}`);
        });
    };
    const add = () => {
        const newItem = createNewArrayItem();
        arrayItemList.appendChild(newItem);
        reindex();
        return newItem;
    };
    const size = () => {
        const listSchemaItems = Array.from(arrayItemList.querySelectorAll(`[data-schema][data-array="${path}"]`));
        return listSchemaItems.length;
    };
    const remove = (index) => {
        const listSchemaItems = Array.from(arrayItemList.querySelectorAll(`[data-schema][data-array="${path}"]`));
        const item = listSchemaItems[index];
        if (!item)
            throw Error('No element at that index');
        arrayItemList.removeChild(item.parentNode);
        reindex();
        return item.parentNode;
    };
    const get = (index) => {
        const listSchemaItems = Array.from(arrayItemList.querySelectorAll(`[data-schema][data-array="${path}"]`));
        const item = listSchemaItems[index];
        if (!item)
            throw Error('No element at that index');
        return item.parentNode;
    };
    arrayFieldset.appendChild(button({ type: 'button', click: add, data: { action: 'add', array: path } }, 'Add'));
    return { add, size, remove, get, reindex };
};
exports.arrayifySchemaForm = (schemaFormEl, h) => {
    if (schemaFormEl[schema_to_form_1.ArrayifySymbol])
        throw Error('Schema form has already been arrayified');
    const arraySchemaEls = Array.from(schemaFormEl.querySelectorAll('[data-schema][data-type="array"]'));
    const api = {};
    arraySchemaEls.forEach(arraySchemaEl => {
        const path = dom_utils_1.strictGetAttribute(arraySchemaEl, 'data-path');
        // we should probably change the way paths are added to dataset etc to have leading '/'
        api['/' + path] = arrayify(arraySchemaEl, h);
    });
    return api;
};
//# sourceMappingURL=arrayify-schema-form.js.map