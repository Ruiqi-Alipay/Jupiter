var express = require('express');
var router = express.Router();
var taskOperator = require('./taskOperator.js');

router.get('/start/:taskId', taskOperator.startTask);

router.param('taskId', taskOperator.taskId);
router.post('/task', taskOperator.newTask);
router.get('/task', taskOperator.getTasks);
router.get('/task/:taskId', taskOperator.getTaskById);
router.delete('/task/:taskId', taskOperator.deleteTask);

module.exports = router;