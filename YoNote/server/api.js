var express = require('express');
var path = require('path');
var userApi = require(path.join(__dirname, 'userApi.js'));
var groupApi = require(path.join(__dirname, 'groupApi.js'));

var router = express.Router();

router.param('userid', userApi.userId);
router.get('/user', userApi.getUser);
router.get('/user/search', userApi.searchUser);
router.delete('/user/:userid', userApi.deleteUser);

router.param('groupId', groupApi.groupId);
router.param('messageId', groupApi.messageId);

router.post('/group', groupApi.createGroup);
router.delete('/group/:groupId', groupApi.deleteGroup);
router.post('/group/:groupId', groupApi.updateGroup);
router.post('/group/:groupId/addmember', groupApi.addMember);
router.post('/group/:groupId/removemember', groupApi.removeMember);
router.get('/group/:groupId/members', groupApi.getGroupMembers);

router.post('/group/:groupId/message', groupApi.createMessage);
router.get('/group/:groupId/message', groupApi.getMessages);
router.get('/group/:groupId/message/contentsearch', groupApi.searchContent);

module.exports = router;