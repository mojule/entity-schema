"use strict";
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const unique_values_1 = require("../utils/unique-values");
const arrays_in_path_1 = require("../utils/arrays-in-path");
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
    it('arrays-in-paths', () => {
        const map = {
            '/foo/0': 'Foo',
            '/foo/1': 'Bar',
            '/bar/0/baz': 'Baz',
            '/bar/0/qux/0': 'Qux 0',
            '/bar/0/qux/1': 'Qux 1',
            '/baz': []
        };
        const expect = {
            '/foo': 2,
            '/bar': 1,
            '/bar/0/qux': 2,
            '/baz': 0
        };
        const arrayInfo = arrays_in_path_1.arrayPointerInfo(map);
        assert.deepEqual(arrayInfo, expect);
    });
});
//# sourceMappingURL=utils.js.map