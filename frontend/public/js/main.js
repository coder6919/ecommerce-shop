// --- IMPORTS ---
// This section imports all the necessary functions from your other script files.
// This is the crucial step that was missing before, causing the blank screen.
import { fetchAllProducts, fetchProductById, fetchCategories } from './api.js';
import { productCardTemplate, productDetailTemplate } from './templates.js';
import { renderAuthPage, handleLogout, renderLoginForm, renderRegisterForm } from './auth.js';
import { renderCartPage, updateCartCount, handleAddToCart, handleRemoveFromCart } from './cart.js';

// --- ATTACH TO WINDOW ---
// This makes key functions globally available so that the 'onclick' attributes
// in your HTML templates can find and execute them. This is essential when using modules.
window.handleLogout = handleLogout;
window.handleAddToCart = handleAddToCart;
window.handleRemoveFromCart = handleRemoveFromCart;
window.renderRegisterForm = renderRegisterForm;
window.renderLoginForm = renderLoginForm;

// Get references to the main content area and the navigation links container.
const app = document.getElementById('app-root');
const navLinks = document.getElementById('nav-links');

// --- State Management ---
let allProducts = []; // Our local cache for all products.
let currentFilters = {
    searchTerm: '',
    category: 'all',
    price: 'all'
};

// --- Navigation Management ---
/**
 * Updates the navigation bar based on the user's login status.
 * We must EXPORT this function so auth.js can import and use it after login/logout.
 */
export function updateNav() {
    const token = localStorage.getItem('authToken');
    if (token) {
        navLinks.innerHTML = `
            <a href="#/login" class="text-gray-600 hover:text-pink-600 p-2" title="Profile"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></a>
            <a href="#/cart" class="relative text-gray-600 hover:text-pink-600 p-2" title="Bag"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg><span id="cart-counter" class="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span></a>
            <button onclick="handleLogout()" class="ml-2 font-medium bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 hidden sm:block">Logout</button>
        `;
        updateCartCount();
    } else {
        navLinks.innerHTML = `<a href="#/login" class="font-medium bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200">Login</a>`;
    }
}


// --- SPA Routing ---
function router() {
    const path = window.location.hash || '#/';
    if (path.startsWith('#/product/')) {
        const productId = path.split('/')[2];
        renderProductDetailPage(productId);
        return;
    }
    switch (path) {
        case '#/':
            renderHomePage();
            break;
        case '#/login':
            renderAuthPage();
            break;
        case '#/cart':
            renderCartPage();
            break;
        default:
            app.innerHTML = `<div class="text-center p-10"><h1 class="text-3xl font-bold">404 - Page Not Found</h1></div>`;
    }
}


// --- Filter and Display Logic ---

function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    if (products.length === 0) {
        productGrid.innerHTML = `<p class="md:col-span-full text-center text-gray-500 py-10">No products found matching your filters.</p>`;
    } else {
        productGrid.innerHTML = `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-in">${products.map(productCardTemplate).join('')}</div>`;
    }
}

function applyFilters() {
    let filteredProducts = [...allProducts];
    if (currentFilters.searchTerm) { filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(currentFilters.searchTerm.toLowerCase())); }
    if (currentFilters.category !== 'all') { filteredProducts = filteredProducts.filter(p => p.category === currentFilters.category); }
    if (currentFilters.price !== 'all') {
        const [min, max] = currentFilters.price.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && (max ? p.price <= max : true));
    }
    displayProducts(filteredProducts);
}

function handleSearch(event) { currentFilters.searchTerm = event.target.value; applyFilters(); }
function handleCategoryChange(event) { currentFilters.category = event.target.value; applyFilters(); }
function handlePriceChange(event) { currentFilters.price = event.target.value; applyFilters(); }


// --- Mobile Filter Sidebar Logic ---
function openFilters() {
    const sidebar = document.getElementById('filter-sidebar');
    const overlay = document.getElementById('filter-overlay');
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
}

function closeFilters() {
    const sidebar = document.getElementById('filter-sidebar');
    const overlay = document.getElementById('filter-overlay');
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
}


// --- Page Rendering Functions ---

async function renderHomePage() {
    app.innerHTML = `
        <div class="md:hidden mb-4"><button id="open-filters-btn" class="w-full flex items-center justify-center gap-2 bg-white border rounded-md py-2 px-4 text-sm font-medium"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h9m-9 4h13m0-4v8m0 0l-4-4m4 4l4-4" /></svg>Filters</button></div>
        <div class="flex flex-col md:flex-row gap-8">
            <div id="filter-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden"></div>
            <aside id="filter-sidebar" class="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white p-6 z-40 transform -translate-x-full sidebar-transition md:relative md:w-1/4 lg:w-1/5 md:transform-none md:p-0 md:bg-transparent">
                <div class="flex justify-between items-center mb-4 md:hidden"><h3 class="text-lg font-semibold">Filters</h3><button id="close-filters-btn" class="text-2xl font-bold">&times;</button></div>
                <div id="category-filters"></div>
                <div id="price-filters"></div>
            </aside>
            <section class="flex-1"><h2 class="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-6">Products For You</h2><div id="product-grid" class="text-center"><p>Loading products...</p></div></section>
        </div>
    `;
    const [products, categories] = await Promise.all([fetchAllProducts(), fetchCategories()]);
    allProducts = products;
    const categoryContainer = document.getElementById('category-filters');
    let categoryHtml = `<h4 class="font-semibold mb-2">Category</h4><div class="space-y-2">`;
    categoryHtml += `<div><input type="radio" id="cat-all" name="category" value="all" checked class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="cat-all" class="ml-3 text-sm text-gray-600">All</label></div>`;
    categories.forEach(category => {
        categoryHtml += `<div><input type="radio" id="cat-${category}" name="category" value="${category}" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="cat-${category}" class="ml-3 text-sm text-gray-600 capitalize">${category}</label></div>`;
    });
    categoryContainer.innerHTML = categoryHtml + `</div>`;
    const priceContainer = document.getElementById('price-filters');
    priceContainer.innerHTML = `
        <h4 class="font-semibold mb-2 mt-6">Price Range</h4>
        <div class="space-y-2">
            <div><input type="radio" id="price-all" name="price" value="all" checked class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="price-all" class="ml-3 text-sm text-gray-600">All</label></div>
            <div><input type="radio" id="price-0-25" name="price" value="0-25" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="price-0-25" class="ml-3 text-sm text-gray-600">₹0 - ₹2,000</label></div>
            <div><input type="radio" id="price-25-50" name="price" value="25-50" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="price-25-50" class="ml-3 text-sm text-gray-600">₹2,000 - ₹4,000</label></div>
            <div><input type="radio" id="price-50-100" name="price" value="50-100" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="price-50-100" class="ml-3 text-sm text-gray-600">₹4,000 - ₹8,000</label></div>
            <div><input type="radio" id="price-100" name="price" value="100-" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"><label for="price-100" class="ml-3 text-sm text-gray-600">₹8,000+</label></div>
        </div>
    `;
    document.getElementById('open-filters-btn').addEventListener('click', openFilters);
    document.getElementById('close-filters-btn').addEventListener('click', closeFilters);
    document.getElementById('filter-overlay').addEventListener('click', closeFilters);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());
    document.querySelectorAll('input[name="category"]').forEach(radio => radio.addEventListener('change', handleCategoryChange));
    document.querySelectorAll('input[name="price"]').forEach(radio => radio.addEventListener('change', handlePriceChange));
    displayProducts(allProducts);
}

async function renderProductDetailPage(productId) {
    app.innerHTML = `<div class="text-center p-10"><h1 class="text-2xl font-bold">Loading...</h1></div>`;
    const product = await fetchProductById(productId);
    app.innerHTML = productDetailTemplate(product);
}


// --- Initial Application Load ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    updateNav();
    router();
});

