var express = require('express');
var router = express.Router();
var scriptOperator = require('./scriptOperator.js');
var folderOperator = require('./folderOperator.js');
var protocolOperator = require('./protocolOperator.js')

router.param('scriptId', scriptOperator.scriptId);
router.get('/scripts', scriptOperator.getScripts);
router.get('/scripts/:scriptId', scriptOperator.getScriptById);
router.post('/scripts', scriptOperator.newScript);
router.post('/scripts/:scriptId', scriptOperator.updateScript);
router.delete('/scripts/:scriptId', scriptOperator.deleteScript);

router.param('folderId', folderOperator.folderId);
router.get('/scriptsfolder', folderOperator.getFolders);
router.post('/scriptsfolder', folderOperator.newFolder);
router.post('/scriptsfolder/:folderId', folderOperator.updateFolder);
router.delete('/scriptsfolder/:folderId', folderOperator.deleteFolder);

router.param('protocolId', protocolOperator.protocolId);
router.get('/protocol', protocolOperator.getProtocol);
router.post('/protocol', protocolOperator.newProtocol);
router.post('/protocol/:protocolId', protocolOperator.updateProtocol);
router.delete('/protocol/:protocolId', protocolOperator.deleteProtocol);

module.exports = router;
