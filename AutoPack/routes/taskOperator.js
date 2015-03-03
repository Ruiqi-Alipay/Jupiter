
module.exports = {
	newTask: function () {
		db.task.insert({
			date: new Date(),
			retry: 0,
		});
	},
	deleteTask: function () {

	},
	listTasks: function () {
		
	}
};