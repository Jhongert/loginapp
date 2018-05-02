const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports = User;