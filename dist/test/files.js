"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_buffers_1 = require("../files/file-buffers");
const assert = require("assert");
const path = require("path");
const buffer_1 = require("buffer");
const fs = require("fs");
describe('files', () => {
    describe('readFileBuffers', () => {
        it('reads files into filebuffers', async () => {
            const aPath = './src/test/fixtures/files/a.txt';
            const bPath = './src/test/fixtures/files/b.txt';
            const paths = [aPath, bPath];
            const fileBuffers = await file_buffers_1.readFileBuffers(paths);
            paths.forEach(key => {
                assert(key in fileBuffers);
            });
            assert(fileBuffers[aPath].length === 1 && fileBuffers[aPath][0] === 65);
            assert(fileBuffers[bPath].length === 1 && fileBuffers[bPath][0] === 66);
        });
        it('bad Path', done => {
            const aPath = 'C:\\a.txt';
            file_buffers_1.readFileBuffers([aPath])
                .then(() => {
                assert(false);
                done();
            })
                .catch(() => done());
        });
    });
    describe('writeFileBuffers', () => {
        it('writes files into filebuffers', async () => {
            const rootPath = './src/test/fixtures/files';
            const cPath = 'c.txt';
            const dPath = 'd.txt';
            const paths = [cPath, dPath];
            const writeBuffers = {
                [cPath]: buffer_1.Buffer.from('C', 'utf8'),
                [dPath]: buffer_1.Buffer.from('D', 'utf8')
            };
            await file_buffers_1.writeFileBuffers(rootPath, writeBuffers);
            const readPaths = paths.map(key => path.posix.join(rootPath, key));
            const fileBuffers = await file_buffers_1.readFileBuffers(readPaths);
            readPaths.forEach(key => {
                assert(key in fileBuffers);
            });
            const [readCPath, readDPath] = readPaths;
            assert(fileBuffers[readCPath].length === 1 && fileBuffers[readCPath][0] === 67);
            assert(fileBuffers[readDPath].length === 1 && fileBuffers[readDPath][0] === 68);
        });
    });
    describe('missingPathsInFileBuffers', () => {
        it('missing files in filebuffer', () => {
            const fileBuffers = {
                'a.txt': buffer_1.Buffer.from('A', 'utf8'),
                'b.txt': buffer_1.Buffer.from('B', 'utf8')
            };
            const missing = file_buffers_1.missingPathsInFileBuffers(fileBuffers, ['a.txt', 'b.txt', 'c.txt']);
            assert(missing.length === 1);
            assert.deepEqual(missing, ['c.txt']);
        });
    });
    describe('hasPathsInFileBuffers', () => {
        it('has files in filebuffers', () => {
            const fileBuffers = {
                'a.txt': buffer_1.Buffer.from('A', 'utf8'),
                'b.txt': buffer_1.Buffer.from('B', 'utf8')
            };
            const success = ['a.txt', 'b.txt'];
            const fail = ['a.txt', 'b.txt', 'c.txt'];
            assert(file_buffers_1.hasPathsInFileBuffers(fileBuffers, success));
            assert(!file_buffers_1.hasPathsInFileBuffers(fileBuffers, fail));
        });
    });
    describe('zipBufferToFileBuffers', () => {
        it('zip to filebuffers', async () => {
            const zip = fs.readFileSync('./src/test/fixtures/files/ef.zip');
            const fileBuffers = await file_buffers_1.zipBufferToFileBuffers(zip);
            const keys = Object.keys(fileBuffers);
            assert(keys.length === 2);
            assert(fileBuffers['e.txt']);
            assert(fileBuffers['f.txt']);
            assert(fileBuffers['e.txt'][0] === 69);
            assert(fileBuffers['f.txt'][0] === 70);
        });
        it('bad buffer', done => {
            const zip = buffer_1.Buffer.alloc(0);
            file_buffers_1.zipBufferToFileBuffers(zip)
                .then(() => {
                assert(false);
                done();
            }).catch(() => done());
        });
    });
    describe('fileBuffersToZipBuffer', () => {
        it('fileBuffers to zipbuffer', async () => {
            const inBuffers = {
                'g.txt': buffer_1.Buffer.from('G', 'utf8'),
                'h.txt': buffer_1.Buffer.from('H', 'utf8')
            };
            const zipBuffer = await file_buffers_1.fileBuffersToZipBuffer(inBuffers);
            const outBuffers = await file_buffers_1.zipBufferToFileBuffers(zipBuffer);
            assert.deepEqual(inBuffers, outBuffers);
        });
    });
});
//# sourceMappingURL=files.js.map