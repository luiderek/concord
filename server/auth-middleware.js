const jwt = require('jsonwebtoken'); // eslint-disable-line
const ClientError = require('./client-error'); // eslint-disable-line
const { JsonWebTokenError } = require('jsonwebtoken');

function authorizationMiddleware(req, res, next) {
  // Got stuck for a while, but it looks like under req.headers 'x-access-token' is uncapitalized.

  // If no token: throw a 401 error with the message 'authentication required'
  if (!req.headers['x-access-token']) {
    // Getting about 15 401 'auth required' errors on refreshing a client in firefox.
    // I still don't know what's causing it, webpack? sockets?
    // Can't find the issue, so it's a problem for future me.
    // Only happens on page load, don't see any end-user impacts.
    console.error('time:', new Date(), 'req keys:', Object.keys(req));
    console.error('method:', req.method, 'protocol:', req.protocol);
    console.error('headers:', req.headers);
    console.error('body:', req.body);
    throw new JsonWebTokenError(401, 'authentication required');
  }

  try {
    // Use jwt.verify() to verify the authenticity of the token and extract its payload
    const payload = jwt.verify(req.headers['x-access-token'], process.env.TOKEN_SECRET);
    // Assign the extracted payload to the user property of the req object.
    req.user = payload;
  } catch (err) {
    next(err);
  }

  // Call next() to let Express know to advance to its next route or middleware.
  next();

  /**
    * References:
    * https://expressjs.com/en/4x/api.html#req.get
    * https://nodejs.org/api/http.html#http_message_headers
    * https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    */
}

function errorMiddleware(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      error: 'invalid access token'
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
}

module.exports = errorMiddleware;

module.exports = authorizationMiddleware;
