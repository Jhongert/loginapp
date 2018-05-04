const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    request = require('request'),
    userController = require('../controllers/user');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// Register
router.get('/register', (req, res) =>{
    res.render('register');
});

// Login
router.get('/login', (req, res) =>{
    res.render('login');
});

router.post('/captcha', (req, res) => {
    if(req.body['g-recaptcha-response'] === undefined || 
        req.body['g-recaptcha-response'] === '' || 
        req.body['g-recaptcha-response'] === null)  {
    
        return res.json({"success" : 0});
    } else {
        const secretKey = process.env.CAPTCHA_SECRET_KEY;

        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + 
            secretKey + "&response=" + req.body['g-recaptcha-response'] + 
            "&remoteip=" + req.connection.remoteAddress;
        
        request(verificationURL, function(error,response,body) {
            body = JSON.parse(body);
            
            if(body.success !== undefined || !body.success) {
                return res.json({"success" : 1});
            } else {
                return res.json({"success" : 0});
            }
        })
    }
})
// Register new user
router.post('/register', (req, res) =>{
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
                    res.json({'error': 'This email is already taken'})
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