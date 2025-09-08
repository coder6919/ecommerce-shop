const User = require('../models/User');

// Correctly export the 'getCart' function.
// The 'exports.' prefix makes this function available for import in other files.
exports.getCart = async (req, res) => {
    try {
        // The user's ID is attached to the request object (req.user.id)
        // by the authMiddleware after verifying the token.
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Correctly export the 'addToCart' function.
exports.addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const itemIndex = user.cart.findIndex(p => p.productId == productId);

        if (itemIndex > -1) {
            // If the product already exists in the cart, just increase the quantity.
            user.cart[itemIndex].quantity += quantity;
        } else {
            // If it's a new product, add it to the cart array.
            user.cart.push({ productId, quantity });
        }
        await user.save(); // Save the updated user document to the database.
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Correctly export the 'removeFromCart' function.
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        // Use the .filter() method to create a new cart array
        // that excludes the item with the matching productId.
        user.cart = user.cart.filter(p => p.productId != productId);
        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

