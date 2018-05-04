const express = require('express'),
    path = require('path'),
    cookiesParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose');

// Connect to database
mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/loginapp';
mongoose.connect(mongoDB);
//mongoose.connect('mongodb://heroku_w9wxzlql:sdf91ct6g5enn7p9gh8urs1ueh@ds115350.mlab.com:15350/heroku_w9wxzlql')
const db = mongoose.connection;

// Routes
const routes = require('./routes/index'),
     users = require('./routes/users');

//Init app
var app = express();

//View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiesParser());

// Static folder(js, css, img)
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: 'asdf1234',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validation
app.use(expValidator());

//Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

app.use('/', routes);
app.use('/users', users);

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
app.listen(PORT, ()=> {
    console.log('Server started on port ' + PORT);
})