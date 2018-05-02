const express = require('express'),
    router = express.Router();
   

// Homepage
router.get('/', ensureLoggedIn, function(req, res){
    res.render('index');
});

function ensureLoggedIn(req, res, next){
   if(req.isAuthenticated()){
        return next();
   } else {
       res.redirect('/users/login');
   }
}
module.exports = router;