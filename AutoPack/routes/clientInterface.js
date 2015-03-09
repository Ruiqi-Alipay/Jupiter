var express = require('express');
var router = express.Router();
var projectOperator = require('./projectOperator.js');

router.param('projectId', projectOperator.projectId);
router.param('taskId', projectOperator.taskId);

router.post('/project', projectOperator.newProject);
router.post('/project/:projectId', projectOperator.editProject);
router.get('/project', projectOperator.getProjects);
router.get('/project/:projectId', projectOperator.getProjectById);
router.delete('/project/:projectId', projectOperator.deleteProject);
router.post('/project/:projectId/task', projectOperator.newTask);
router.get('/project/:projectId/task', projectOperator.getTasks);
router.delete('/project/:projectId/task/:taskId', projectOperator.deleteTask);

router.get('/project/:projectId/start/:taskId', projectOperator.startTask);
router.get('/project/:projectId/active', projectOperator.activeProject);

module.exports = router;