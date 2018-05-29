"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Busboy = require("busboy");
exports.getMultipartData = async (req) => new Promise((resolve, reject) => {
    try {
        const { headers } = req;
        const busboy = new Busboy({ headers });
        const fields = {};
        const files = [];
        busboy.on('field', (key, value) => fields[key] = value);
        busboy.on('file', (fieldname, stream, originalname, encoding, mimetype) => {
            const file = {
                fieldname,
                originalname,
                encoding,
                mimetype,
                stream,
                size: 0,
                destination: '',
                filename: '',
                path: '',
                buffer: Buffer.from('')
            };
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                file.buffer = Buffer.concat(chunks);
                files.push(file);
            });
        });
        busboy.on('finish', () => resolve({ fields, files }));
        req.pipe(busboy);
    }
    catch (err) {
        reject(err);
    }
});
//# sourceMappingURL=get-multipart-values.js.map