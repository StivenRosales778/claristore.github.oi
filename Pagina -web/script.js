// --- BASE DE DATOS DE PRODUCTOS ---
const products = [
    { id: 1, name: "Vestido Elegante Rosado", category: "Ropa", price: 1250.00, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Blusa Casual con Encaje", category: "Ropa", price: 650.00, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Zapatos Altos de Tacón Fino", category: "Calzado", price: 1450.00, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "Zapatillas Urbanas Blancas", category: "Calzado", price: 1100.00, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "Bolso de Mano Elegante", category: "Accesorios", price: 950.00, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop" },
    { id: 6, name: "Gafas de Sol Clásicas", category: "Accesorios", price: 480.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop" },
    { id: 7, name: "Pantalón de Vestir Estilizado", category: "Ropa", price: 890.00, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&auto=format&fit=crop" },
    { id: 8, name: "Sandalias de Verano", category: "Calzado", price: 780.00, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400&auto=format&fit=crop" },
    { id: 9, name: "Collar Minimalista Dorado", category: "Accesorios", price: 350.00, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop" },
    { id: 10, name: "Chaqueta Casual de Moda", category: "Ropa", price: 1600.00, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop" }
];

// --- ESTADO ---
let currentUser = JSON.parse(localStorage.getItem('clarita_current_user')) || null;
let cart = []; 
let favorites = JSON.parse(localStorage.getItem('clarita_favorites')) || [];
let activeCategory = 'Todos';
let authMode = 'register';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    updateAuthUI();
});

// --- RENDERIZADO DE PRODUCTOS ---
function renderProducts(itemsToRender) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (itemsToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fa-solid fa-face-frown text-4xl text-clarita-rose mb-2"></i>
                <p class="text-clarita-dark font-medium">No se encontraron productos disponibles.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = itemsToRender.map(product => `
        <div class="product-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-clarita-pink/40 flex flex-col justify-between transition-all duration-300 relative group">
            <div>
                <div class="relative w-full h-48 rounded-xl overflow-hidden bg-clarita-bg mb-3">
                    <img src="${product.image}" alt="${product.name}" class="product-img w-full h-full object-cover transition-transform duration-500" onerror="this.src='https://placehold.co/400x400/FAF2F2/70121E?text=Clarita+Store'">
                    <button onclick="toggleFavorite(${product.id})" class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-xs rounded-full flex items-center justify-center text-clarita-wine hover:bg-white shadow transition-colors cursor-pointer">
                        <i class="${favorites.includes(product.id) ? 'fa-solid text-clarita-rose' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <span class="absolute bottom-2 left-2 bg-clarita-wine/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        ${product.category}
                    </span>
                </div>
                <h3 class="font-serif-title font-bold text-clarita-dark text-sm sm:text-base line-clamp-1">${product.name}</h3>
            </div>
            
            <div class="pt-4 mt-2 border-t border-clarita-bg flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-gray-500 block uppercase">Precio</span>
                    <span class="font-bold text-clarita-wine text-base">C$ ${product.price.toFixed(2)}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="bg-clarita-wine hover:bg-clarita-dark text-white p-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- FILTROS Y BÚSQUEDA ---
function filterByCategory(category) {
    activeCategory = category;
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('bg-clarita-wine', 'text-white');
        btn.classList.add('bg-white', 'text-clarita-dark', 'border', 'border-clarita-pink');
    });
    
    const activeBtnId = `filter-${category.toLowerCase()}`;
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-clarita-dark', 'border', 'border-clarita-pink');
        activeBtn.classList.add('bg-clarita-wine', 'text-white');
    }

    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    applyFiltersAndSearch(category, searchTerm);
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    applyFiltersAndSearch(activeCategory, searchTerm);
}

function applyFiltersAndSearch(category, searchTerm) {
    let filtered = products;

    if (category !== 'Todos') {
        filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm.trim() !== '') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    renderProducts(filtered);
}

// --- CARRITO DE COMPRAS Y PAGOS ---
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('hidden');
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`"${product.name}" añadido al carrito`);
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.innerText = totalItems;

    const bodyContent = document.getElementById('cart-body-content');
    if (!bodyContent) return;

    if (cart.length === 0) {
        bodyContent.innerHTML = `
            <div class="text-center py-16 space-y-3">
                <i class="fa-solid fa-bag-shopping text-5xl text-clarita-pink"></i>
                <p class="font-serif-title font-bold text-clarita-wine text-lg">Tu carrito está vacío</p>
                <p class="text-xs text-gray-500 max-w-xs mx-auto">Explora nuestra colección y añade prendas o accesorios para realizar tu pedido.</p>
            </div>
        `;
        return;
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = subtotal > 2000 ? 0 : 150;
    let total = subtotal + shipping;

    bodyContent.innerHTML = `
        <div class="space-y-3 divide-y divide-clarita-pink/30">
            ${cart.map(item => `
                <div class="py-3 flex items-center justify-between gap-3 first:pt-0">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-clarita-pink/40 shrink-0">
                    <div class="flex-grow">
                        <h4 class="font-bold text-xs text-clarita-dark line-clamp-1">${item.name}</h4>
                        <p class="text-xs font-semibold text-clarita-wine mt-0.5">C$ ${item.price.toFixed(2)}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 bg-clarita-card hover:bg-clarita-pink text-clarita-wine rounded flex items-center justify-center text-xs cursor-pointer">-</button>
                            <span class="text-xs font-bold">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 bg-clarita-card hover:bg-clarita-pink text-clarita-wine rounded flex items-center justify-center text-xs cursor-pointer">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>
            `).join('')}
        </div>

        <div class="bg-white p-4 rounded-xl border border-clarita-pink/40 space-y-2 text-xs">
            <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>C$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-gray-600">
                <span>Envío estimado</span>
                <span>${shipping === 0 ? '¡Gratis!' : 'C$ ' + shipping.toFixed(2)}</span>
            </div>
            <div class="pt-2 border-t border-clarita-pink/30 flex justify-between font-bold text-sm text-clarita-wine">
                <span>Total a pagar</span>
                <span>C$ ${total.toFixed(2)}</span>
            </div>
        </div>

        <div class="space-y-3 pt-2">
            <h4 class="font-serif-title font-bold text-clarita-wine text-sm">Datos de Envío y Pago</h4>
            <input type="text" id="checkout-name" placeholder="Nombre completo" value="${currentUser ? currentUser.name : ''}" class="w-full px-3 py-2 text-xs border border-clarita-pink rounded-lg focus:outline-none focus:border-clarita-wine">
            <input type="text" id="checkout-address" placeholder="Dirección exacta de entrega" class="w-full px-3 py-2 text-xs border border-clarita-pink rounded-lg focus:outline-none focus:border-clarita-wine">
            <input type="tel" id="checkout-phone" placeholder="Teléfono de contacto" class="w-full px-3 py-2 text-xs border border-clarita-pink rounded-lg focus:outline-none focus:border-clarita-wine">
            
            <button onclick="checkoutOrder()" class="w-full bg-clarita-wine hover:bg-clarita-dark text-white py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-check-to-slot"></i>
                <span>Confirmar Pedido (WhatsApp / Sistema)</span>
            </button>
        </div>
    `;
}

// --- AUTENTICACIÓN Y GESTIÓN DE SESIÓN ---
function openAuthModal(mode) {
    authMode = mode;
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-modal-title');
    const subtitle = document.getElementById('auth-modal-subtitle');
    const icon = document.getElementById('auth-modal-icon');
    const btn = document.getElementById('auth-submit-btn');
    const nameContainer = document.getElementById('name-field-container');
    const toggleText = document.getElementById('auth-toggle-text');

    if (mode === 'register') {
        title.innerText = "Registrarse";
        subtitle.innerText = "Crea tu cuenta para guardar tus datos internamente";
        icon.className = "fa-solid fa-user-plus text-lg";
        btn.innerText = "Registrarse";
        nameContainer.style.display = 'block';
        document.getElementById('auth-name').required = true;
        toggleText.innerHTML = `¿Ya tienes cuenta? <button type="button" onclick="switchAuthMode('login')" class="text-clarita-wine font-bold underline cursor-pointer">Inicia sesión</button>`;
    } else {
        title.innerText = "Iniciar Sesión";
        subtitle.innerText = "Ingresa a tu cuenta de Clarita Store";
        icon.className = "fa-solid fa-right-to-bracket text-lg";
        btn.innerText = "Iniciar Sesión";
        nameContainer.style.display = 'none';
        document.getElementById('auth-name').required = false;
        toggleText.innerHTML = `¿No tienes cuenta? <button type="button" onclick="switchAuthMode('register')" class="text-clarita-wine font-bold underline cursor-pointer">Regístrate</button>`;
    }

    modal.classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthMode(mode) {
    openAuthModal(mode);
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (authMode === 'register') {
        const name = document.getElementById('auth-name').value;
        currentUser = { name, email };
        localStorage.setItem('clarita_current_user', JSON.stringify(currentUser));
        showToast(`¡Bienvenida, ${name}! Cuenta creada con éxito.`);
    } else {
        currentUser = { name: email.split('@')[0], email };
        localStorage.setItem('clarita_current_user', JSON.stringify(currentUser));
        showToast(`¡Bienvenida de nuevo, ${currentUser.name}!`);
    }

    closeAuthModal();
    updateAuthUI();
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('clarita_current_user');
    updateAuthUI();
    showToast("Sesión cerrada correctamente");
}

function updateAuthUI() {
    const statusBar = document.getElementById('auth-status-bar');
    if (!statusBar) return;

    if (currentUser) {
        statusBar.innerHTML = `
            <div class="flex items-center gap-1 text-clarita-pink">
                <i class="fa-solid fa-user"></i>
                <span class="font-bold">${currentUser.name}</span>
            </div>
            <button onclick="logoutUser()" class="text-gray-300 hover:text-white underline ml-1 cursor-pointer">Salir</button>
        `;
    } else {
        statusBar.innerHTML = `
            <button onclick="openAuthModal('login')" class="hover:text-clarita-pink transition-colors cursor-pointer">Iniciar sesión</button>
            <span>/</span>
            <button onclick="openAuthModal('register')" class="hover:text-clarita-pink transition-colors cursor-pointer">Registrarse</button>
        `;
    }
}

// --- FAVORITOS ---
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast("Producto eliminado de favoritos");
    } else {
        favorites.push(productId);
        showToast("Producto añadido a favoritos");
    }
    localStorage.setItem('clarita_favorites', JSON.stringify(favorites));
    renderProducts(products);
}

// --- PEDIDOS Y UTILIDADES ---
function checkoutOrder() {
    const name = document.getElementById('checkout-name').value;
    const address = document.getElementById('checkout-address').value;
    const phone = document.getElementById('checkout-phone').value;

    if (!name || !address || !phone) {
        showToast("Por favor complete todos los datos de envío");
        return;
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = subtotal > 2000 ? 0 : 150;
    let total = subtotal + shipping;

    let message = `¡Hola Clarita Store! Deseo realizar el siguiente pedido:%0A`;
    cart.forEach(item => {
        message += `- ${item.quantity}x ${item.name} (C$ ${item.price.toFixed(2)})%0A`;
    });
    message += `%0ASubtotal: C$ ${subtotal.toFixed(2)}%0A`;
    message += `Envío: C$ ${shipping.toFixed(2)}%0A`;
    message += `Total a Pagar: C$ ${total.toFixed(2)}%0A%0A`;
    message += `Datos de Envío:%0ANombre: ${name}%0ADirección: ${address}%0ATeléfono: ${phone}`;

    window.open(`https://wa.me/50558682458?text=${message}`, '_blank');
    cart = [];
    toggleCart();
    updateCartUI();
    showToast("¡Pedido generado con éxito!");
}

function handleNewsletter(e) {
    e.preventDefault();
    showToast("¡Gracias por suscribirte a nuestro boletín!");
    e.target.reset();
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    msgEl.innerText = message;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}