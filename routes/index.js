const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Homepage
router.get('/', ensureLoggedIn('/users/login'), function(req, res){
    res.render('index');
});

module.exports = router;