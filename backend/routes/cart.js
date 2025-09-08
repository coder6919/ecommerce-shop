const express = require('express');
const router = express.Router();

// Import the security middleware. This function runs before any of our cart
// functions to ensure the user is logged in and their token is valid.
const authMiddleware = require('../middleware/auth');

// This is the key line that fixes the error.
// It uses object destructuring `{...}` to properly import the named functions
// (getCart, addToCart, removeFromCart) that you exported from the cartController.js file.
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

// Handles GET requests to /api/cart
// This route is protected; it requires a valid token.
// The authMiddleware runs first, and if successful, it passes control to getCart.
router.get('/', authMiddleware, getCart);

// Handles POST requests to /api/cart/add
// This route is protected and used to add an item to the user's cart.
router.post('/add', authMiddleware, addToCart);

// Handles POST requests to /api/cart/remove
// This route is protected and used to remove an item from the user's cart.
router.post('/remove', authMiddleware, removeFromCart);

// Export the router so it can be used by your main server.js file.
module.exports = router;

