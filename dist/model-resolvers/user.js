"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const pify = require("pify");
const types_1 = require("../security/types");
const hash = pify(bcrypt.hash);
exports.userResolver = async (access, document, model) => {
    if (access === types_1.EntityAccesses.create || access === types_1.EntityAccesses.update) {
        document['password'] = await hash(model.password, 10);
    }
    return { document };
};
//# sourceMappingURL=user.js.map