"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const path = require("path");
const is_1 = require("@mojule/is");
const ensure_directories_1 = require("../utils/ensure-directories");
exports.fileResolvers = {
    default: {
        destination: (req, file, cb) => {
            const { mimetype } = file;
            const fileMetaData = req['_wsMetadata'];
            let { title, Model, model } = fileMetaData;
            model = model || new Model();
            fileMetaData.model = model;
            const rootDirectory = mimetype.startsWith('image') ? 'img' : 'files';
            const entityPath = `public/${rootDirectory}/${lodash_1.kebabCase(title)}`;
            const idSlug = is_1.is.string(model['abbrev']) ? model['abbrev'] : model.id;
            const modelPath = `${entityPath}/${idSlug}`;
            ensure_directories_1.ensureDirectories(entityPath, modelPath);
            cb(null, modelPath);
        },
        filename: (req, file, cb) => {
            const parsed = path.parse(file.originalname);
            const filename = lodash_1.kebabCase(file.fieldname) + parsed.ext;
            cb(null, filename);
        }
    }
};
//# sourceMappingURL=index.js.map