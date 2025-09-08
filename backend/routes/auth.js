const express = require('express');
const router = express.Router();

// This is the key line that fixes the error.
// It uses object destructuring `{...}` to properly import the named functions
// (register, login) that you exported from the authController.js file.
// This ensures that 'register' and 'login' are correctly recognized as functions.
const { register, login } = require('../controllers/authController');

// Handles POST requests to the /api/auth/register endpoint.
// When a request comes in, it will be handled by the imported 'register' function.
router.post('/register', register);

// Handles POST requests to the /api/auth/login endpoint.
// When a request comes in, it will be handled by the imported 'login' function.
router.post('/login', login);

// Export the router so it can be used by your main server.js file.
module.exports = router;

