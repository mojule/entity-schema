"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const pify = require("pify");
const yauzl = require("yauzl");
const yazl = require("yazl");
const ensure_directories_1 = require("../utils/ensure-directories");
const writeFile = pify(fs.writeFile);
const readFile = pify(fs.readFile);
const assertPosixPath = (targetPath, name) => {
    if (targetPath.includes('\\'))
        throw Error(`Expected ${name} in posix format`);
};
exports.writeFileBuffers = async (rootPath, fileBuffers) => {
    assertPosixPath(rootPath, 'rootPath');
    const paths = Object.keys(fileBuffers);
    return Promise.all(paths.map(filePath => {
        assertPosixPath(filePath, 'filePath');
        const buffer = fileBuffers[filePath];
        const writePath = path.posix.join(rootPath, filePath);
        ensure_directories_1.ensureParentFolders(writePath);
        return writeFile(writePath, buffer);
    }));
};
exports.readFileBuffers = async (paths) => {
    paths.forEach((current, i) => assertPosixPath(current, `paths[${i}]`));
    const fileBuffers = {};
    return Promise.all(paths.map(async (filePath) => {
        fileBuffers[filePath] = await readFile(filePath);
    })).then(() => fileBuffers);
};
exports.missingPathsInFileBuffers = (fileBuffers, paths) => {
    const fileBufferPaths = Object.keys(fileBuffers);
    return paths.filter(p => !fileBufferPaths.includes(p));
};
exports.hasPathsInFileBuffers = (fileBuffers, paths) => exports.missingPathsInFileBuffers(fileBuffers, paths).length === 0;
const defaultZipToFileBuffersOptions = {
    filter: _s => true,
    map: s => s
};
exports.zipBufferToFileBuffers = async (zipFileBuffer, options = defaultZipToFileBuffersOptions) => {
    options = Object.assign({}, defaultZipToFileBuffersOptions, options);
    const { filter, map } = options;
    const fileBuffers = {};
    return new Promise((resolve, reject) => {
        yauzl.fromBuffer(zipFileBuffer, { lazyEntries: true }, (err, zipfile) => {
            if (err) {
                reject(err);
                return;
            }
            zipfile.readEntry();
            zipfile.on('entry', entry => {
                // skip empty folders and unexpected files
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                }
                if (!filter(entry.fileName)) {
                    zipfile.readEntry();
                }
                else {
                    let chunks = [];
                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err)
                            return reject(err);
                        if (readStream === undefined)
                            return reject(Error('no readStream'));
                        readStream.on('data', (chunk) => chunks.push(chunk));
                        readStream.on('end', () => {
                            const buffer = Buffer.concat(chunks);
                            const fileName = map(entry.fileName);
                            fileBuffers[fileName] = buffer;
                            zipfile.readEntry();
                        });
                        readStream.on('error', err => {
                            reject(err);
                        });
                    });
                }
            });
            zipfile.on('error', err => {
                reject(err);
            });
            // use end with fromBuffer because close is only emitted when streaming
            zipfile.on('end', () => {
                resolve(fileBuffers);
            });
        });
    });
};
const defaultBeforeEnd = async (zip) => { };
exports.fileBuffersToZipBuffer = async (fileBuffers, beforeEnd = defaultBeforeEnd) => {
    const zip = new yazl.ZipFile();
    Object.keys(fileBuffers).forEach(key => zip.addBuffer(fileBuffers[key], key, {
        mtime: new Date(),
        mode: parseInt("0100664", 8)
    }));
    await beforeEnd(zip);
    return new Promise((resolve, reject) => {
        try {
            const bufs = [];
            zip.outputStream.on('data', d => bufs.push(d));
            zip.outputStream.on('end', () => resolve(Buffer.concat(bufs)));
            zip.end();
        }
        catch (err) {
            reject(err);
        }
    });
};
//# sourceMappingURL=file-buffers.js.map