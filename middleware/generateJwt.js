const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the user
 * @param {Object} payload - Payload to embed in the token
 * @param {string} expiresIn - Token expiration time
 * @returns {Object} - The generated JWT token
 * **/

function generateToken(payload, expiresIn = '1h') {
    try {
        if (!process.env.JWT_SIGNING_KEY) {
            return { success: false, message: `No signing key is defined in the environment variables`, statusCode: 502 };
        }
        return { success: true, message: jwt.sign(payload, process.env.JWT_SIGNING_KEY, { expiresIn }), statusCode: 202 };
    } catch (e) {
        return { success: false, message: `Error occurred while generating token.`, statusCode: 500 };
    }
}

module.exports = {
    generateToken
};