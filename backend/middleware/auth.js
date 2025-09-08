const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from the Authorization header (e.g., "Bearer TOKEN_STRING")
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add the user's ID from the token to the request object
        req.user = decoded;
        next(); // Proceed to the next function (the controller)
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid.' });
    }
};
