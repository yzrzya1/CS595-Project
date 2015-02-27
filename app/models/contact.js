var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contactSchema = new Schema(
{
	admin:[{
	  	firstName : String,
		lastName : String,
		Email : String,
		address : {streetAddress:String,city:String,state:String,postalCode:String},
		phoneNumber : [{type:String,number:String}]
	}]
});
module.exports = mongoose.model('Contact', contactSchema);

//mongoose.model('Contact', {});

// var contactSchema = new Schema({
// 	admin:[Object]
// });

/*
var Schema = mongoose.Schema;



var addressSchema = new Schema({
	streetAddress:String,city:String,state:String,postalCode:String
});
var phoneNumberSchema = new Schema(
	{type:String,number:String}
);
var userSchema = new Schema({
	  	firstName : String,
		lastName : String,
		Email : String,
		address : addressSchema,
		phoneNumber : phoneNumberSchema
	});
var adminSchema = new Schema({
	admin:[userSchema]
});


*/
/*
module.exports = mongoose.model('Contact', 
	{
	admin:[{
	  	firstName : String,
		lastName : String,
		Email : String,
		address : {streetAddress:String,city:String,state:String,postalCode:String},
		phoneNumber : [{type:String,number:String}]
	}]
});
*/
/*
var Schema = mongoose.Schema;
module.exports = mongoose.model('Contact', {}
	//{ any: Schema.Types.Mixed }
	);


*/