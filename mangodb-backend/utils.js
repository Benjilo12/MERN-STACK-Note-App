const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token from request headers
function authenticateToken(req, res, next) {
  // Get the Authorization header value (format: 'Bearer <token>')
  const authHeader = req.headers["authorization"];

  // Extract the token from the header (after 'Bearer ')
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, respond with 401 Unauthorized
  if (!token) return res.sendStatus(401);

  // Verify the token using the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // If token is invalid or expired, respond with 401 Unauthorized
    if (err) return res.sendStatus(401);

    // Attach the decoded user payload to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
}

// Export the middleware function
module.exports = {
  authenticateToken,
};
