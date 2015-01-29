var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
	uname : String,
	pname : String,
	client : String,
	tasks : String,
	message : String,
	file : String,
	progress : String
	
});