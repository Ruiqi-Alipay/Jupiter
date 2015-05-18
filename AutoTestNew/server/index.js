var router = require('express').Router(),
	clientOperator = require('./client-operator');

router.post('/report', require('./api-report-create'));
router.get('/report', require('./api-report-list'));
router.get('/report/search', require('./api-report-search'));
router.get('/report/:report_id', require('./api-report-get'));
router.delete('/report/:report_id', require('./api-report-delete'));

router.post('/package', require('./api-package-create'));
router.get('/package', require('./api-package-list'));
router.delete('/package/:package_id', require('./api-package-delete'));
router.get('/testapp', require('./api-client-app'));

router.post('/parameter', require('./api-parameter-create'));
router.put('/parameter/:parameter_id', require('./api-parameter-update'));
router.get('/parameter/search', require('./api-parameter-search'));
router.get('/parameter', require('./api-parameter-list'));
router.delete('/parameter/:parameter_id', require('./api-parameter-delete'));

router.post('/script', require('./api-script-create'));
router.put('/script/:script_id', require('./api-script-update'));
router.get('/script/config', require('./api-script-config-list'));
router.get('/script/detail/:script_id', require('./api-script-get'));
router.get('/script/folder/:folder_id', require('./api-script-list'));
router.delete('/script/:script_id', require('./api-script-delete'));

router.post('/folder', require('./api-folder-create'));
router.put('/folder/:folder_id', require('./api-folder-update'));
router.get('/folder', require('./api-folder-list'));
router.delete('/folder/:folder_id', require('./api-folder-delete'));

router.get('/sysconfiglist', clientOperator.getSystemConfigs);
router.get('/environment/checkversion', clientOperator.getVersion);
router.get('/scriptlist', clientOperator.getScriptsMeun);
router.get('/getscripts', clientOperator.getScriptById);
router.get('/creditcard', clientOperator.generateCreditCard);

router.post('/login', require('./api-login'));

module.exports = router;