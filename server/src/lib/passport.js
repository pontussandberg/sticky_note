const passport = require('passport');
const { v4 } = require('uuid')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
require('dotenv').config();

const createUser = (profile, done) => {
    const user = {
        googleID: profile.id,
        email: profile._json.email,
        userID: v4(),
    };

    Promise.all([db.initNotes(user.userID), db.insertUser(user)])
        .then(() => done(null, user));
};

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    db.getUserByGoogleID(profile.id)
        .then(user => user
            ? done(null, user)
            : createUser(profile, done)
        );
}));


module.exports = passport;