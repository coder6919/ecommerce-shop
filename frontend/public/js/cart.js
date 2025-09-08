import { addToCartAPI, getCart, fetchProductById, removeFromCartAPI } from './api.js';
import { cartItemTemplate } from './templates.js';

/**
 * Handles the click event for adding a product to the cart.
 * @param {number} productId - The ID of the product to add.
 * @param {Event} event - The click event, used to target the button for visual feedback.
 */
export async function handleAddToCart(productId, event) {
    if (!localStorage.getItem('authToken')) {
        alert('Please log in to add items to your bag.');
        window.location.hash = '#/login';
        return;
    }

    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Adding...';
    button.disabled = true;

    try {
        await addToCartAPI(productId);
        button.textContent = 'Added!';
        updateCartCount();
    } catch (error) {
        alert('Could not add item. Please try again.');
        button.textContent = originalText;
    } finally {
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }
}

/**
 * Handles removing an item from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
export async function handleRemoveFromCart(productId) {
    if (!confirm('Are you sure you want to remove this item from your bag?')) {
        return;
    }
    await removeFromCartAPI(productId);
    renderCartPage(); // Re-render the cart to show the item has been removed.
}

/**
 * Renders the full shopping cart page. This version contains the corrected
 * "Continue Shopping" link for an empty cart.
 */
export async function renderCartPage() {
    const app = document.getElementById('app-root');
    app.innerHTML = `<div class="text-center p-10"><h1 class="text-2xl font-bold">Loading your bag...</h1></div>`;

    const userCartItems = await getCart();
    
    if (!userCartItems || userCartItems.length === 0) {
        // **THIS IS THE KEY FIX**: The href attribute is now "/#/", which correctly
        // navigates to the homepage within the single-page application.
        app.innerHTML = `<div class="text-center p-10 animate-fade-in"><h1 class="text-2xl font-bold">Your Bag is Empty</h1><a href="/#/" class="text-pink-600 hover:underline mt-2 inline-block">Continue Shopping</a></div>`;
        return;
    }

    // Fetch the full details for each product in the cart.
    const productDetailsPromises = userCartItems.map(item => fetchProductById(item.productId));
    const productDetails = await Promise.all(productDetailsPromises);
    
    let subtotal = 0;
    let cartListHtml = '';

    productDetails.forEach((product, index) => {
        const cartItem = userCartItems[index];
        cartListHtml += `<li class="flex py-6">${cartItemTemplate(product, cartItem)}</li>`;
        subtotal += (product.price * 80) * cartItem.quantity;
    });

    // Construct the final page with the generated list of items and the subtotal.
    app.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="text-3xl font-bold mb-8 text-gray-900">Shopping Bag</h1>
            <ul role="list" class="-my-6 divide-y divide-gray-200">
                ${cartListHtml}
            </ul>
            <div class="border-t border-gray-200 py-6 px-4 sm:px-6 mt-8">
                <div class="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹${subtotal.toFixed(2)}</p>
                </div>
                <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div class="mt-6">
                    <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700">Checkout</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Updates the small cart counter number in the navigation bar.
 */
export async function updateCartCount() {
    const cartCounter = document.getElementById('cart-counter');
    if (!cartCounter) return;

    if (!localStorage.getItem('authToken')) {
        cartCounter.textContent = '0';
        return;
    }
    
    try {
        const cartItems = await getCart();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    } catch (error) {
        console.error("Could not update cart count:", error);
        cartCounter.textContent = '0';
    }
}

