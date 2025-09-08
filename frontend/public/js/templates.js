export const productCardTemplate = (product) => `
    <div class="group relative bg-white border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-xl">
        <a href="#/product/${product.id}" class="block">
            <div class="w-full h-56 sm:h-64 bg-white flex items-center justify-center p-4"><img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain"></div>
            <div class="p-4 border-t border-gray-100">
                <h3 class="text-sm font-bold text-gray-800 capitalize">${product.category}</h3>
                <p class="text-sm text-gray-600 truncate mt-1" title="${product.title}">${product.title}</p>
                <p class="text-sm font-semibold text-gray-900 mt-2">₹${(product.price * 80).toFixed(2)}</p>
            </div>
        </a>
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <button onclick="handleAddToCart(${product.id}, event)" class="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">Add to Bag</button>
        </div>
    </div>
`;
export const authPageTemplate = () => `
    <div class="min-h-[60vh] flex items-center justify-center bg-gray-50 animate-fade-in">
        <div class="w-full max-w-4xl bg-white shadow-2xl rounded-xl flex flex-col md:flex-row overflow-hidden">
            <div class="hidden md:block w-full md:w-1/2 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2670&auto=format&fit=crop');"></div>
            <div class="w-full md:w-1/2 p-8 md:p-12"><div id="auth-form-container"></div></div>
        </div>
    </div>
`;
export const loginFormTemplate = () => `
    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login</h2>
    <p class="text-gray-600 mb-8">Welcome back! Please enter your details.</p>
    <form id="login-form">
        <div class="mb-4"><label for="email" class="block text-sm font-medium text-gray-700">Email</label><input type="email" id="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></div>
        <div class="mb-6"><label for="password" class="block text-sm font-medium text-gray-700">Password</label><input type="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></div>
        <button type="submit" class="w-full bg-pink-600 text-white font-semibold py-2.5 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400">Sign in</button>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">Don't have an account? <button onclick="renderRegisterForm()" class="font-medium text-pink-600 hover:underline">Sign up</button></p>
`;
export const registerFormTemplate = () => `
    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
    <p class="text-gray-600 mb-8">Let's get you started!</p>
    <form id="register-form">
        <div class="mb-4"><label for="name" class="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></div>
        <div class="mb-4"><label for="email" class="block text-sm font-medium text-gray-700">Email</label><input type="email" id="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></div>
        <div class="mb-6"><label for="password" class="block text-sm font-medium text-gray-700">Password</label><input type="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"></div>
        <button type="submit" class="w-full bg-pink-600 text-white font-semibold py-2.5 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400">Create Account</button>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">Already have an account? <button onclick="renderLoginForm()" class="font-medium text-pink-600 hover:underline">Login</button></p>
`;
export const cartItemTemplate = (product, item) => `
    <div class="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"><img src="${product.image}" alt="${product.title}" class="h-full w-full object-contain object-center"></div>
    <div class="ml-4 flex flex-1 flex-col">
        <div>
            <div class="flex justify-between text-sm sm:text-base font-medium text-gray-900"><h3><a href="#/product/${product.id}">${product.title}</a></h3><p class="ml-4">₹${(product.price * 80 * item.quantity).toFixed(2)}</p></div>
            <p class="mt-1 text-sm text-gray-500 capitalize">${product.category}</p>
        </div>
        <div class="flex flex-1 items-end justify-between text-sm"><p class="text-gray-500">Qty: ${item.quantity}</p><div class="flex"><button onclick="handleRemoveFromCart(${product.id})" type="button" class="font-medium text-pink-600 hover:text-pink-500">Remove</button></div></div>
    </div>
`;
export const productDetailTemplate = (product) => `
    <div class="flex flex-col md:flex-row -mx-4 animate-fade-in">
        <div class="md:flex-1 px-4"><div class="h-80 md:h-96 rounded-lg bg-white mb-4 flex items-center justify-center p-4 border"><img class="h-full w-full object-contain" src="${product.image}" alt="Product Image"></div></div>
        <div class="md:flex-1 px-4">
            <p class="text-gray-500 text-sm mb-2 capitalize">${product.category}</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">${product.title}</h2>
            <div class="flex mb-4"><span class="font-bold text-gray-700 text-2xl">₹${(product.price * 80).toFixed(2)}</span></div>
            <p class="text-gray-600 mb-6 text-sm sm:text-base">${product.description}</p>
            <div class="flex -mx-2"><div class="w-full px-2"><button onclick="handleAddToCart(${product.id}, event)" class="w-full bg-pink-600 text-white py-3 px-4 rounded-full font-bold hover:bg-pink-700 transition-transform transform hover:scale-105">Add to Bag</button></div></div>
        </div>
    </div>
`;

