const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/user');
const User = mongoose.model('User');

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/register', function(req, res){
    let name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        password2 = req.body.password2;

    req.checkBody('name', 'Name is requiered').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password should be at least 7 chars long').isLength({ min: 6 });
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

     if(errors){
         let dataErr = []
         errors.map(err => {
             dataErr.push(err.msg)
         })
         res.json(dataErr)
    } else {
        let user = new User(req.body);
        user.save(function() {

        })
    }
});
module.exports = router;