// require the handlers
const handlers = require('./handlers.js');
const express = require('express');

// build the router
const router = express.Router();

router.get('/', (req, res) => {
  res.send('files API!');
});

// add routes to router

router.get('/files', handlers.getFiles);

// read a file
//  called by action: fetchAndLoadFile
router.get('/files/:name', handlers.getFilesName);

// write a file
//  called by action: saveFile
router.post('/files/:name', handlers.postFilesName);

// delete a file
//  called by action: deleteFile
router.delete('/files/:name', handlers.deleteFile);

// export the router
module.exports = router;

