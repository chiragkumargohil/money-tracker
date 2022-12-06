import path from 'path';
const __dirname = path.resolve();
import * as dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import passport from 'passport';
import session from 'express-session';

import Routes from './routes/route.js';
import './routes/auth.js';

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
app.get('/auth/google/home',
    passport.authenticate('google', { failureRedirect: '/login', successReturnToOrRedirect: '/' }));

app.use('/', Routes);

let port = 8000;

app.listen(port, function () {
    console.log("Server started successfully on server", port);
});