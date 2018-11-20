"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const pify = require("pify");
const types_1 = require("../security/types");
const hash = pify(bcrypt.hash);
exports.apiKeyResolver = async (access, document) => {
    if (access !== types_1.EntityAccesses.create)
        return { document };
    const secret = uuid.v4();
    const apiKey = Buffer.from(`${document._id.toString()}:${secret}`).toString('base64');
    document['secret'] = await hash(secret, 10);
    const meta = {
        apiKey,
        message: `
      Your new API key is ${apiKey} - please save this somewhere safe, as you
      will not be able to retrieve it. If you lose it, delete the old key and
      generate a new one.
    `
    };
    return { document, meta };
};
//# sourceMappingURL=api-key.js.map