const passport = require('passport');

const verifyCallback = (req, resolve, reject, requiredRole) => async (err, user, info) => {
    if (err || info) {
        return reject('Please authenticate');
    }

    resolve();
};

const auth = (...requiredRole) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRole))(req, res, next);
    })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
