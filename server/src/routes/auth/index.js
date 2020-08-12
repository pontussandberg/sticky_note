const router = require('express').Router();
const passport = require('passport');
const db = require('../../lib/db');

const checkForUserID = (x) => x === null
    ? { userID: false }
    : x

router.get('/google', passport.authenticate('google', { scope: ['email', 'openid'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
}));

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.status(200).end()
});

router.get('/authenticate', (req, res) => {
    const id = req.hasOwnProperty('user') ? req.user.userID : null;
    if (id === null) return res.status(401).json({ authentic: false });

    const response = isAuth => isAuth
        ? res.status(200).json({ authentic: true })
        : res.status(401).json({ authentic: false })

    db.getUserByID(req.user.userID)
        .then(checkForUserID)
        .then(x => x.userID === req.user.userID)
        .then(response)
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;