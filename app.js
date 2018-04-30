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
    mongo = require('mongo'),
    mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

// Routes
const routes = require('./routes/index'),
      users = require('./routes/users');

//Init app
const app = express();

//View engine
app.use('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: layout }));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookiesParser());

// Static folder(js, css, img)
app.use(express.static(path.join(__diename, 'public')));

// Express session
app.use(session({
    secret: 'asdf1234',
    saveUninitialized: true,
    resave: true
}));

// Express validation
app.use(expValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formaParam = root;
        
        while(namespace.length){
            formaParam += '[' + namespace.shift() + ']';
        }

        return {
            param : formaParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', routes);
app.use('/users', users);

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
app.listen(PORT, ()=> {
    console.log('Server started on port ' + PORT);
} )