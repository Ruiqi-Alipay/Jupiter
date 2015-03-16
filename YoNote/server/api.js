var express = require('express');
var path = require('path');
var userApi = require(path.join(__dirname, 'userApi.js'));
var groupApi = require(path.join(__dirname, 'groupApi.js'));

var router = express.Router();

router.param('userExtId', userApi.userExtId);
router.get('/user/:userExtId', userApi.getUser);

router.param('groupId', groupApi.groupId);
router.param('messageId', groupApi.messageId);
router.post('/group', groupApi.createGroup);
router.post('/group/:groupId', groupApi.updateGroup);
router.post('/group/:groupId/addmember', groupApi.addMember);
router.post('/group/:groupId/removemember', groupApi.removeMember);
router.post('/group/:groupId/message', groupApi.createMessage);
router.delete('/group/:groupId', groupApi.deleteGroup);
router.get('/group/:groupId/message', groupApi.getMessages);
router.get('/group/:groupId/message/:messageId', groupApi.geMessage);

module.exports = router;