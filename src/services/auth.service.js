const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');
const { tokenTypes } = require('../config.passport');

const generateToken = (expires, type, secret = config.jwt.secret) => {
    const payload = {
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
};
  
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
        },
        refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
        },
    };
};

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
};

module.exports = {
    generateToken,
    generateAuthTokens,
    verifyToken
}