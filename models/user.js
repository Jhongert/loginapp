const mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
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

module.exports.createUser = function(newUser, cb){
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) =>{
			newUser.password = hash;
			newUser.save(cb);
		});
	});
}

module.exports.getUserByUsername = function(username, cb){
	let query = {usename: username};
	User.findOne(query, cb);
}

module.exports.getUserById = function(id, cb){
	User.findById(id, cb);
}

module.exports.comparePassword = function(password, hash, cb){
	bcrypt.compare(password, hash, (err, isMatch) => {
		if(err) throw err;
		cb(null, isMatch);
	});
}
module.exports = User;