const express = require('express'),
    router = express.Router();
   
function ensureLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/users/login');
}
    
// Homepage
router.get('/', ensureLoggedIn, (req, res) => res.render('index'));

module.exports = router;