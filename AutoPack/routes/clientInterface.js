var express = require('express');
var router = express.Router();
var taskOperator = require('./taskOperator.js');
var projectOperator = require('./projectOperator.js');

router.get('/start/:taskId', taskOperator.startTask);

router.param('taskId', taskOperator.taskId);
router.post('/task', taskOperator.newTask);
router.get('/task', taskOperator.getTasks);
router.get('/task/:taskId', taskOperator.getTaskById);
router.delete('/task/:taskId', taskOperator.deleteTask);

router.param('projectId', projectOperator.projectId);
router.post('/project', projectOperator.newProject);
router.post('/project/:projectId', projectOperator.editProject);
router.get('/project', projectOperator.getProjects);
router.get('/project/:projectId', projectOperator.getProjectById);
router.delete('/project/:projectId', projectOperator.deleteProject);

module.exports = router;