const fs = require('fs');
const path = require('path');
const config = require('../config');
const util = require('util');

// define FILES_DIR
const FILES_DIR = path.join(__dirname, "../files-dev");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const unlinkFile = util.promisify(fs.unlink);

// declare the handlers
const handlers = {
    getFiles: async (req, res, next) => {
        try {
            const list = await readDir(FILES_DIR);
            res.json(list);
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                res.status(404).end();
                return;
            }
            if (err) {
                next(err);
                return;
            }
        }
    },
    getFilesName: async (req, res, next) => {
        const fileName = req.params.name;
        try {
            const fileText = await readFile(`${FILES_DIR}/${fileName}`, "utf-8");

            const responseData = {
                name: fileName,
                text: fileText,
            };

            res.json(responseData);
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                res.status(404).end();
                return;
            }
            if (err) {
                next(err);
                return;
            }
        }
    },
    postFilesName: async (req, res, next) => {
        const fileName = req.params.name;
        const fileText = req.body.text;

        try {
            await writeFile(`${FILES_DIR}/${fileName}`, fileText);

            // refactor hint:
            res.redirect(303, '/api/files');
            // handlers.getFiles(req, res, next);
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                res.status(404).end();
                return;
            }
            if (err) {
                next(err);
                return;
            }
        }
    },
    deleteFile: async (req, res, next) => {
        const fileName = req.params.name;

        try {
            await unlinkFile(`${FILES_DIR}/${fileName}`);

            // refactor hint:
            res.redirect(303, '/api/files');
            // handlers.getFiles(req, res, next);
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                res.status(404).end();
                return;
            }
            if (err) {
                next(err);
                return;
            }
        }
    }

};

// export the handlers
module.exports = handlers;
