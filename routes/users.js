const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    //User = require('../models/user'),
    userController = require('../controllers/user');

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

// Register new user
router.post('/register', function(req, res){
    let name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is requiered').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password should be at least 6 chars long').isLength({ min: 6 });
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        let dataErr = []
        errors.map(err => {
            dataErr.push(err.msg)
        })
        res.json(dataErr)
    } else {
        userController.getUserByEmail(email,
            (err, user) => {
                if (user) {
                    res.json({'error': 'This email already exist'})
                } else {
                    const data = {
                        name: name,
                        email: email,
                        password: password
                    };
                    userController.createUser(data, (err, user) => {
                        if (err) throw err;
                        req.flash('success_msg', 'You are registerd and can now login');
                        res.json({'msg': "success"})
                    });
                }
            }
        )
    }
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        userController.getUserByEmail(email, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: "Unknow User" });
            }
            userController.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Invalid password"});
                }
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    userController.getUserById(id, (err, user) => {
        done(err, user);
    });
});

router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/users/login',
        failureFlash: 'Invalid username or password' 
    })
);

router.get('/logout',(req, res) => {
    req.logout();
    res.redirect('/users/login');
})
module.exports = router;