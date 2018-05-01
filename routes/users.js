const express = require('express'),
    router = express.Router();

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/register', function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('name', 'Name is requiered').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is requiered').notEmpty();
    req.checkBody('password', 'Password is requiered').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    let errors = req.validationErrors();

    if(errors){
        errs = {}
        errors.map(err => {
            errs[err.param] = {
                msg: err.msg
            }
        })
       
        res.render('register', {
            errors: errs
        })
    } else {
        console.log('no error')
    }
});
module.exports = router;