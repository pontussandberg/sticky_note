const passport = require('passport');
const { v4 } = require('uuid')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbNotes = require('./db/db_notes');
const dbUsers = require('./db/db_users');
require('dotenv').config();

const createUser = (profile, done) => {
    const user = {
        googleID: profile.id,
        email: profile._json.email,
        userID: v4(),
    };

    Promise.all([dbNotes.initNotes(user.userID), dbUsers.insertUser(user)])
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
    dbUsers.getUserByGoogleID(profile.id)
        .then(user => user
            ? done(null, user)
            : createUser(profile, done)
        );
}));


module.exports = passport;