"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("lodash.camelcase");
const upperFirst = require("lodash.upperfirst");
exports.pascalCase = (str) => upperFirst(camelCase(str));
//# sourceMappingURL=pascal-case.js.map