"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_utils_1 = require("@mojule/dom-utils");
const oneOfEvents = (oneOfElement) => {
    const isWired = oneOfElement.dataset.wired === 'true';
    if (isWired)
        return;
    oneOfElement.dataset.wired = 'true';
    const path = oneOfElement.dataset.path;
    const radios = Array.from(oneOfElement.querySelectorAll(`input[type="radio"][name="/${path + '/?'}"]`));
    const count = radios.length;
    let selected = '0';
    radios.forEach(radio => {
        if (radio.checked)
            selected = radio.value;
    });
    radios.forEach(radio => {
        radio.checked = radio.value === selected;
    });
    const optionEls = [];
    for (let i = 0; i < count; i++) {
        const optionEl = dom_utils_1.strictSelect(oneOfElement, `div[data-path="${path}/?${i}"]`);
        optionEls.push(optionEl);
    }
    const toggleOptions = () => {
        for (let i = 0; i < count; i++) {
            const optionEl = dom_utils_1.strictSelect(oneOfElement, `div[data-path="${path}/?${i}"]`);
            if (String(i) === selected) {
                optionEl.style.display = 'block';
                const noValidateEls = optionEl.querySelectorAll('[formnovalidate]');
                noValidateEls.forEach(el => {
                    el.removeAttribute('formnovalidate');
                    el.setAttribute('required', '');
                });
            }
            else {
                optionEl.style.display = 'none';
                const requiredEls = optionEl.querySelectorAll('[required]');
                requiredEls.forEach(el => {
                    el.removeAttribute('required');
                    el.setAttribute('formnovalidate', '');
                });
            }
        }
    };
    toggleOptions();
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                selected = radio.value;
            }
            toggleOptions();
        });
    });
};
exports.oneOfSchemaForm = (schemaFormEl, h) => {
    const oneOfSchemaEls = Array.from(schemaFormEl.querySelectorAll('[data-schema][data-one-of]'));
    oneOfSchemaEls.forEach(oneOfEvents);
};
//# sourceMappingURL=oneof-schema-form.js.map