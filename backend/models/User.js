const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // The cart stores product IDs from the Fake Store API
    cart: [
        {
            productId: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
