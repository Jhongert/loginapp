const mongoose = require('mongoose'),
    User = require('../models/user'),
    bcrypt = require('bcryptjs');

require('../models/user');

exports.createUser = function(data, cb){
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(data.password, salt, (err, hash) =>{
            data.password = hash;
            newUser = new User(data);
			newUser.save(cb);
		});
	});
}

exports.getUserByEmail = function(email, cb){
	let query = {email: email};
	User.findOne(query, cb);
}

exports.getUserById = function(id, cb){
	User.findById(id, cb);
}

exports.comparePassword = function(password, hash, cb){
	bcrypt.compare(password, hash, (err, isMatch) => {
		if(err) throw err;
		cb(null, isMatch);
	});
}