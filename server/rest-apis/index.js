var router = require('express').Router();

// WEB: report related api
router.post('/report', require('./api-report-create'));
router.get('/report', require('./api-report-list'));
router.get('/report/search', require('./api-report-search'));
router.get('/report/:report_id', require('./api-report-get'));
router.delete('/report/:report_id', require('./api-report-delete'));

router.post('/package', require('./api-package-create'));
router.get('/package', require('./api-package-list'));
router.delete('/package/:package_id', require('./api-package-delete'));

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

router.post('/user', require('./api-user-create'));
router.post('/user/signin', require('./api-user-signin'));
router.post('/user/signout', require('./api-user-signout'));
router.put('/user', require('./api-user-update'));
router.delete('/user', require('./api-user-delete'));

router.get('/client/package', require('./client-package-list'));
router.get('/client/platform', require('./client-platform-check'));
router.get('/client/version', require('./client-version-check'));
router.get('/client/script', require('./client-script-list'));
router.get('/client/detail', require('./client-script-get'));

router.get('/convert', function (req, res, next) {
	require('../mongodb/folder')
		.update({ username: { $exists: false }}, { username: 'yuhe' }, { multi: true }, function (err, result) {
			require('../mongodb/package')
				.update({ username: { $exists: false }}, { username: 'yuhe' }, { multi: true }, function (err, result) {
					require('../mongodb/parameter')
						.update({ username: { $exists: false }}, { username: 'yuhe' }, { multi: true }, function (err, result) {
							require('../mongodb/script')
								.update({ username: { $exists: false }}, { username: 'yuhe' }, { multi: true }, function (err, array) {
									res.json({success: true});
								});
						});
				});
		});
});

router.get('/remove', function (req, res, next) {
	require('../mongodb/report')
		.remove({ username: { $exists: false }}, function (err, result) {
			res.json({f: true});
		});
});

module.exports = router;
