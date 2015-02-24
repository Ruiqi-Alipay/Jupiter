var express = require('express');
var router = express.Router();
var scriptOperator = require('./scriptOperator.js');
var folderOperator = require('./folderOperator.js');
var prameterOperator = require('./prameterOperator.js');
var appOperator = require('./appOperator.js');
var reportOperator = require('./reportOperator.js');
var clientOperator = require('./clientOperator.js');

router.get('/sysconfiglist', clientOperator.getSystemConfigs);
router.get('/environment/checkversion', clientOperator.getVersion);
router.get('/scriptlist', clientOperator.getScriptsMeun);
router.get('/getscripts', clientOperator.getScriptById);

router.param('appId', appOperator.appId);
router.post('/testapp', appOperator.newApp);
router.get('/testapp', appOperator.getApps);
router.delete('/testapp/:appId', appOperator.deleteApp);

router.param('prameterId', prameterOperator.prameterId);
router.get('/scriptparameter', prameterOperator.getPrameters);
router.post('/scriptparameter', prameterOperator.newPrameter);
router.post('/scriptparameter/:prameterId', prameterOperator.updatePrameter);
router.delete('/scriptparameter/:prameterId', prameterOperator.deletePrameter);

router.param('folderId', folderOperator.folderId);
router.get('/testscriptfolder', folderOperator.getFolders);
router.post('/testscriptfolder', folderOperator.newFolder);
router.post('/testscriptfolder/:folderId', folderOperator.updateFolder);
router.delete('/testscriptfolder/:folderId', folderOperator.deleteFolder);

router.param('scriptId', scriptOperator.scriptId);
router.get('/testscript', scriptOperator.getScripts);
router.get('/testscript/:scriptId', scriptOperator.getScriptById);
router.post('/testscript', scriptOperator.newScript);
router.post('/testscript/:scriptId', scriptOperator.updateScript);
router.delete('/testscript/:scriptId', scriptOperator.deleteScript);

router.param('reportId', reportOperator.reportId);
router.post('/report', reportOperator.newReport);
router.get('/testreport', reportOperator.getReports);
router.delete('/testreport/:reportId', reportOperator.deleteReport);
router.get('/api/reportdata', reportOperator.getReportData);

module.exports = router;