var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

module.exports = {
	getSystemConfigs: function (req, res, next) {
	  TestScript.find({type: 'SysConfig'}, function(err, scripts){
	    if(err){ return next(err); }

	    res.json(scripts);
	  });
	},
	getVersion: function (req, res, next) {
	  fs.readFile(path.join(__dirname, '..', 'environment', 'verison.json'), function(err, data) {
	    if (err) {
	      console.log(err);
	      return next(err);
	    } else {
	      var system = JSON.parse(data);
	      res.json(system);
	    }
	  });
	},
	getScriptsMeun: function (req, res, next) {
	  TestScript.find({type: 'Script'}, function(err, scripts){
	    if(err){ return next(err); }

	    var hasScritpFolderMap = {};
	    var unFolderedScript = [];
	    scripts.forEach(function(script) {
	      if (script.folder && 'UNFORDERED' != script.folder) {
	        hasScritpFolderMap[script.folder] = '';
	      } else {
	        unFolderedScript.push(script);
	      }
	    });

	    TestScriptFolder.find(function(err, folders){
	      if(err){ return next(err); }

	      var selectList = [];
	      var folderMap = {};
	      var index = 0;
	      folders.forEach(function(folder) {
	        if (folder._id in hasScritpFolderMap) {
	          index++;
	          folderMap[folder._id] = folder.title;
	          selectList.push({
	            title: folder.title,
	            key: '' + index
	          });

	          var scriptIndex = 1;
	          scripts.forEach(function(script) {
	            if (script.folder == folder._id) {
	              selectList.push({
	                title: script.title,
	                key: index + '.' + scriptIndex,
	                id: script._id
	              });
	              scriptIndex++;
	            }
	          });
	        }
	      });

	      if (unFolderedScript.length > 0) {
	        index++;
	        selectList.push({
	          title: '未分组脚本',
	          key: index
	        });

	        unFolderedScript.forEach(function(script, scriptIndex) {
	          selectList.push({
	            title: script.title,
	            key: index + '.' + (scriptIndex + 1),
	            id: script._id
	          });
	        });
	      }

	      res.json(selectList);
	    });
	  });
	},
	getScriptById: function (req, res, next) {
	  var ids = req.param('ids');
	  if (ids) {
	    ScriptParameter.find(function(err, params){
	      var idArray = ids.split(',');
	      TestScript.find({'_id': {'$in' : idArray}}, function(err, scripts) {
	        if(err){ return next(err); }

	        TestScriptFolder.find(function(err, folders){
	          if(err){ return next(err); }

	          var folderNameMap = {};
	          folders.forEach(function(item) {
	            folderNameMap[item._id] = item.title;
	          });

	          var clientScripts = [];
	          scripts.forEach(function(script) {
	            var item = JSON.parse(script.content);
	            item.title = item.title + '-' + folderNameMap[script.folder];
	            clientScripts.push(item);
	          });

	          var configIds = [];
	          clientScripts.forEach(function(script) {
	            if (script.configRef) {
	              configIds.push(script.configRef);
	            }
	          });


	          TestScript.find({$or: [{'_id': {'$in' : configIds}}, {'title': 'ROLLBACK_ACTIONS'}]}, function(err, configs) {
	              if(err){ return next(err); }

	              var clientConfigs = [];
	              configs.forEach(function(config) {
	                var item = JSON.parse(config.content);
	                item.id = config._id;
	                clientConfigs.push(item);
	              });

	              res.json({
	                scripts: clientScripts,
	                configs: clientConfigs,
	                params: params
	              });
	          });

	        });
	      });
	    });
	  } else {
	    res.json({error: 'ids not provided'});
	  }
	}
};