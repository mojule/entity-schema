"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Busboy = require("busboy");
exports.getMultipartFields = async (req) => new Promise((resolve, reject) => {
    try {
        const { headers } = req;
        const busboy = new Busboy({ headers });
        const fields = {};
        busboy.on('field', (key, value) => fields[key] = value);
        busboy.on('finish', function () {
            resolve(fields);
        });
        req.pipe(busboy);
    }
    catch (err) {
        reject(err);
    }
});
//# sourceMappingURL=get-multipart-values.js.map