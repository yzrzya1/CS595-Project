var mongoose = require('mongoose');

module.exports = mongoose.model('Contact', {
	firstName : String,
	lastName : String,
	Email : String,
	address : {streetAddress:String,city:String,state:String,postalCode:String},
	phoneNumber : [{type:String,number:String},{type:String,number:String}]
});