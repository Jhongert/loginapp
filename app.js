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

mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

