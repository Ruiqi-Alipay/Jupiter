var express = require('express');
var router = express.Router();

var projectOperator = require('./projectOperator.js');
var taskOperator = require('./taskOperator.js');

router.param('projectId', projectOperator.projectId);
router.post('/project', projectOperator.createProject);
router.post('/project/:projectId', projectOperator.editProject);
router.get('/project', projectOperator.getProjects);
router.get('/project/:projectId', projectOperator.getProjectById);
router.delete('/project/:projectId', projectOperator.deleteProject);

router.param('taskId', taskOperator.taskId);
router.post('/task/:projectId', taskOperator.createTask);
router.get('/task/active', taskOperator.getProjectActiveTasks);
router.get('/task/history', taskOperator.getProjectHistoryTasks);
router.delete('/task/:taskId', taskOperator.deleteTask);
router.post('/task/send/:taskId', taskOperator.sendEmail);
router.get('/task/record/:taskId', taskOperator.getRecord);

module.exports = router;