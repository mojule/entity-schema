"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const is_1 = require("@mojule/is");
exports.EntityStorage = (fileResolvers) => {
    const getDestination = (req, file, cb) => {
        const { title } = req['_wsMetadata'];
        let destination;
        if (title in fileResolvers) {
            destination = fileResolvers[title].destination;
        }
        else {
            destination = fileResolvers.default.destination;
        }
        if (is_1.is.string(destination) || is_1.is.undefined(destination))
            throw Error('Expected diskStorage destination to be in function form');
        destination(req, file, cb);
    };
    const _handleFile = (req, file, cb) => {
        getDestination(req, file, (err, outPath) => {
            if (err)
                return cb(err);
            const { title } = req['_wsMetadata'];
            const parsed = path.parse(file.originalname);
            if (parsed.ext === '.zip') {
                if (title in fileResolvers) {
                    const resolvers = fileResolvers[title];
                    const { zip } = resolvers;
                    if (zip !== undefined) {
                        return zip(req, file, (err, outPath) => {
                            if (err)
                                return cb(err);
                            cb(null, {
                                path: outPath,
                                size: 0
                            });
                        });
                    }
                }
            }
            let filename;
            if (title in fileResolvers) {
                filename = fileResolvers[title].filename;
            }
            else {
                filename = fileResolvers.default.filename;
            }
            if (is_1.is.string(filename) || is_1.is.undefined(filename))
                throw Error('Expected diskStorage filename to be in function form');
            filename(req, file, (err, filename) => {
                outPath = path.join(outPath, filename);
                fs.writeFile(outPath, file.buffer, err => {
                    if (err)
                        return cb(err);
                    cb(null, {
                        path: outPath,
                        size: file.buffer.length
                    });
                });
                // const outStream = fs.createWriteStream( outPath )
                // file[ 'stream' ].pipe( outStream )
                // outStream.on( 'error', cb )
                // outStream.on( 'finish', function() {
                //   cb( null, {
                //     path: outPath,
                //     size: outStream.bytesWritten
                //   } )
                // } )
            });
        });
    };
    const _removeFile = (req, file, cb) => fs.unlink(file.path, cb);
    const api = { getDestination, _handleFile, _removeFile };
    return api;
};
//# sourceMappingURL=entity-storage.js.map