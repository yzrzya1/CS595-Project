var mongoose = require('mongoose');

module.exports = mongoose.model('It', {
		uname: String,
		lname:String,
		role: String,
		email: String	
});