const MY_API_URL = 'https://eshop-backend-syed.onrender.com';
const FAKE_STORE_API_URL = 'https://fakestoreapi.com';

export const fetchAllProducts = async () => (await fetch(`${FAKE_STORE_API_URL}/products`)).json();
export const fetchProductById = async (id) => (await fetch(`${FAKE_STORE_API_URL}/products/${id}`)).json();
export const fetchCategories = async () => (await fetch(`${FAKE_STORE_API_URL}/products/categories`)).json();

export const registerUser = async (name, email, password) => {
    const response = await fetch(`${MY_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${MY_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const getCart = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${MY_API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

export const addToCartAPI = async (productId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${MY_API_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity: 1 }),
    });
    return response.json();
};

export const removeFromCartAPI = async (productId) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${MY_API_URL}/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId }),
    });
    return response.json();
};
