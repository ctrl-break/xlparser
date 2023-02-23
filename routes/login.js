const express = require('express');
const hash = require('pbkdf2-password')()
const router = express.Router();
const env = require('../.env.js');

const users = {
    [env.USERNAME]: { name: env.USERNAME }
};

// when you create a user, generate a salt
// and hash the password

hash({ password: env.PASSWORD }, function (err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.berenge.salt = salt;
    users.berenge.hash = hash;
});


function authenticate(name, pass, fn) {
    const user = users[name];
    // query the db for the given username
    if (!user) return fn(null, null)
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user)
        fn(null, null)
    });
}

router.post('/', function (req, res, next) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (err) return next(err)
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function () {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('/xlparser');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('/xlogin');
        }
    });
});

router.get('/', function (req, res, next) {
    res.render('login', { title: 'Login page' });
});

module.exports = router;
