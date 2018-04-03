"use strict";
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const unique_values_1 = require("../utils/unique-values");
describe('Utils', () => {
    describe('array', () => {
        describe('uniqueValues', () => {
            it('only accepts arrays', () => {
                assert.throws(() => unique_values_1.uniqueValues({}));
            });
            it('only accepts object arrays', () => {
                assert.throws(() => unique_values_1.uniqueValues(['a']));
            });
            it('requires every object has the property name', () => {
                const objs = [
                    { name: '' },
                    { name: '' },
                    { bad: '' }
                ];
                assert.throws(() => unique_values_1.uniqueValues(objs, 'name'));
            });
            it('throws on missing property name', () => {
                const objs = [
                    { name: 'a' },
                    { name: 'b' }
                ];
                assert.throws(() => unique_values_1.uniqueValues(objs));
            });
        });
    });
});
//# sourceMappingURL=utils.js.map