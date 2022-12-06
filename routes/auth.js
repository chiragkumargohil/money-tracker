import * as dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { User } from '../database/dbConnection.js';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function (accessToken, refreshToken, profile, cb) {
    User.findOne({ googleId: profile.id }, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            user = new User({
                name: profile.displayName,
                email_id: profile.emails[0].value,
                googleId: profile.id
            });
            user.save(function (err) {
                if (err) console.log(err);
                return cb(err, user);
            })
        } else {
            return cb(err, user);
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});