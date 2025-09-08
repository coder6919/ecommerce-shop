// --- IMPORTS ---
// This section imports all the necessary functions from your other script files.
// It's a critical part of the module-based Vite setup.
import { authPageTemplate, loginFormTemplate, registerFormTemplate } from './templates.js';
import { loginUser, registerUser } from './api.js';
import { updateNav } from './main.js';

/**
 * Renders the main authentication page structure and defaults to the login form.
 * EXPORTED so it can be called by the router in main.js.
 */
export function renderAuthPage() {
    const app = document.getElementById('app-root');
    app.innerHTML = authPageTemplate();
    renderLoginForm();
}

/**
 * Injects the login form HTML into the auth page container and attaches its submit event listener.
 * EXPORTED so it can be called by main.js and the template file.
 */
export function renderLoginForm() {
    const container = document.getElementById('auth-form-container');
    if (container) {
        container.innerHTML = loginFormTemplate();
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    } else {
        console.error('Fatal Error: auth-form-container not found.');
    }
}

/**
 * Injects the registration form HTML into the auth page container and attaches its submit event listener.
 * EXPORTED so it can be called by main.js and the template file.
 */
export function renderRegisterForm() {
    const container = document.getElementById('auth-form-container');
    if (container) {
        container.innerHTML = registerFormTemplate();
        document.getElementById('register-form').addEventListener('submit', handleRegister);
    } else {
        console.error('Fatal Error: auth-form-container not found.');
    }
}

/**
 * Handles the user registration form submission.
 * @param {Event} event - The form submission event.
 */
async function handleRegister(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const button = event.target.querySelector('button');
    button.textContent = 'Creating Account...';
    button.disabled = true;
    try {
        const result = await registerUser(name, email, password);
        if (result.token) {
            alert('Account created successfully! You are now logged in.');
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userName', name); // Use the name from the form
            updateNav();
            window.location.hash = '#/';
        } else {
            alert(`Registration failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
    } finally {
        button.textContent = 'Create Account';
        button.disabled = false;
    }
}

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
async function handleLogin(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const button = event.target.querySelector('button');
    button.textContent = 'Signing in...';
    button.disabled = true;
    try {
        const result = await loginUser(email, password);
        if (result.token) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userName', result.userName);
            updateNav();
            window.location.hash = '#/';
        } else {
            alert(`Login failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    } finally {
        button.textContent = 'Sign in';
        button.disabled = false;
    }
}

/**
 * Handles the user logout process.
 * EXPORTED so it can be called by main.js.
 */
export function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    updateNav();
    window.location.hash = '#/';
}

