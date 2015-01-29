var mongoose = require('mongoose');

module.exports = mongoose.model('Logininfo', {
	uname : String,
	upsd : String,
	urole : Number
});