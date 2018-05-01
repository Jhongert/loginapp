var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String, 
		require: true
	}
});

// UserSchema.path('name').validate(function(val) {
//     return val.length;
// }, 'Name cannot be blank');

// UserSchema.path('email').validate(function(val) {
//     return val.length;
// }, 'Email cannot be blank');

// UserSchema.path('password').validate(function(val) {
//     return val.length > 5;
// }, 'Password has to be at least 6 characters long');

var User = mongoose.model('User', UserSchema);

module.exports = User;