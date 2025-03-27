class Store {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.products = JSON.parse(localStorage.getItem('products')) || [
            { id: 1, name: 'Fresh Milk', price: 399, image: 'https://images.stockcake.com/public/d/8/8/d889c86e-4f30-4c8f-9c51-4bb5b27fb4ac_medium/milk-splash-dance-stockcake.jpg' },
            { id: 2, name: 'Artisan Cheese', price: 699, image: 'https://www.dailyartmagazine.com/wp-content/uploads/2019/02/800px-Floris_Claesz._van_Dyck_001.jpg' },
            { id: 3, name: 'Creamy Yogurt', price: 299, image: 'https://thumbs.dreamstime.com/b/warm-wooden-table-showcases-various-dairy-products-like-milk-cheese-butter-surrounded-rustic-decor-flowers-345844068.jpg' },
            { id: 4, name: 'Organic Butter', price: 499, image: 'https://media.istockphoto.com/id/1458068034/photo/chocolate-ingredients.jpg?s=612x612&w=0&k=20&c=06vu3hRO7tEYRY6w6FNEkwmT2EVRce4xRlJoxcrW7fY=' },
            { id: 5, name: 'Fresh Cream', price: 449, image: 'https://st.depositphotos.com/1031062/3183/i/450/depositphotos_31839883-stock-photo-sour-cream.jpg' },
            { id: 6, name: 'Pure Ghee', price: 999, image: 'https://i.pinimg.com/474x/15/9f/a5/159fa5bcb2f05aadfa3b8498163e389a.jpg' }
        ];
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === Number(productId));
        if (!product) return;
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) existing.quantity++;
        else this.cart.push({ ...product, quantity: 1 });
        this.saveCart();
        this.updateCartUI();
        gsap.fromTo('.cart-count', { scale: 1.2 }, { scale: 1, duration: 0.3 });
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== Number(productId));
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addProduct(product) {
        const newId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        this.products.push({ id: newId, ...product });
        localStorage.setItem('products', JSON.stringify(this.products));
        this.updateProductGrid();
        this.updateAdminProducts();
    }

    removeProduct(productId) {
        this.products = this.products.filter(p => p.id !== Number(productId));
        localStorage.setItem('products', JSON.stringify(this.products));
        this.updateProductGrid();
        this.updateAdminProducts();
    }

    addOrder(order) {
        this.orders.push(order);
        localStorage.setItem('orders', JSON.stringify(this.orders));
        this.updateAdminOrders();
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItems.innerHTML = this.cart.length ? this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} × ${item.quantity}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('') : '<p>Your cart is empty</p>';
        cartTotal.textContent = formatPrice(this.getTotal());
    }

    updateProductGrid() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = this.products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" class="product-image" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)} - ${product.name.includes('Milk') || product.name.includes('Cream') ? '1L' : '500g'}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => this.addToCart(btn.dataset.id));
        });
    }

    updateAdminProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = this.products.map(product => `
            <div class="admin-product-item">
                <span>${product.name} - ${formatPrice(product.price)}</span>
                <button class="remove-item" data-id="${product.id}">Remove</button>
            </div>
        `).join('');
    }

    updateAdminOrders() {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = this.orders.length ? this.orders.map((order, index) => `
            <div class="admin-order-item">
                <span>Order #${index + 1} - ${formatPrice(order.total)}</span>
                <span>${order.method}</span>
            </div>
        `).join('') : '<p>No orders yet</p>';
    }
}

const store = new Store();
const els = {
    loader: document.getElementById('loader'),
    navbar: document.getElementById('navbar'),
    menuToggle: document.querySelector('.menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    cartContainer: document.querySelector('.cart-container'),
    cartModal: document.getElementById('cart-modal'),
    checkoutBtn: document.getElementById('checkout-btn'),
    carousel: document.getElementById('carousel'),
    backToHome: document.getElementById('back-to-home'),
    stats: document.querySelectorAll('.stat-item'),
    counters: document.querySelectorAll('.counter'),
    sustainItems: document.querySelectorAll('.sustain-item'),
    products: document.querySelectorAll('.product-card'),
    contactForm: document.querySelector('.contact-form'),
    loginModal: document.getElementById('login-modal'),
    closeLogin: document.getElementById('close-login'),
    paymentModal: document.getElementById('payment-modal'),
    closePayment: document.getElementById('close-payment'),
    paymentMethods: document.getElementById('payment-methods'),
    adminModal: document.getElementById('admin-modal'),
    closeAdmin: document.getElementById('close-admin'),
    adminLink: document.getElementById('admin-link'),
    adminFooterLink: document.getElementById('admin-footer-link')
};

// Logo 3D Animation
function initLogo() {
    const logo = document.getElementById('logo-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(50, 50);
    logo.prepend(renderer.domElement);

    // Create a group for the bottle
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // Main bottle body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c6e49,
        specular: 0x555555,
        shininess: 30
    });
    const bottle = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bottleGroup.add(bottle);

    // Bottle neck
    const neckGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 32);
    const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
    neck.position.y = 1.2;
    bottleGroup.add(neck);

    // Cap
    const capGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const capMaterial = new THREE.MeshPhongMaterial({ color: 0x4a9c6d });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1.5;
    bottleGroup.add(cap);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Animation
    function animate() {
        bottleGroup.rotation.y += 0.02;
        bottleGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

// Analytics 3D Animation
(function initAnalytics3D() {
    const container = document.getElementById('analytics-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, 200);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x2c6e49 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
})();

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

window.addEventListener('load', () => {
    els.loader.classList.add('hidden');
    setTimeout(() => els.loader.remove(), 500);
    store.updateCartUI();
    store.updateProductGrid();
    store.updateAdminProducts();
    store.updateAdminOrders();
    animateOnScroll();
});

window.addEventListener('scroll', debounce(() => {
    els.navbar.classList.toggle('scrolled', window.scrollY > 50);
    animateOnScroll();
}, 16));

els.menuToggle.addEventListener('click', () => {
    els.navLinks.classList.toggle('active');
    els.menuToggle.textContent = els.navLinks.classList.contains('active') ? '×' : '☰';
});

els.navLinks.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && item.querySelector('.dropdown')) {
            e.preventDefault();
            item.classList.toggle('active');
        }
    });
});

els.cartContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('theme-toggle')) {
        els.cartModal.classList.toggle('open');
    }
});

els.backToHome.addEventListener('click', () => {
    els.cartModal.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

els.cartModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        store.removeFromCart(e.target.dataset.id);
    }
});

const carouselItems = els.carousel.querySelectorAll('.carousel-item');
const carouselBgs = els.carousel.querySelectorAll('.carousel-bg');
let currentSlide = 0;

function updateCarousel() {
    carouselBgs.forEach((bg, i) => bg.classList.toggle('active', i === currentSlide));
    carouselItems.forEach((item, i) => {
        const isActive = i === currentSlide;
        item.classList.toggle('active', isActive);
        gsap.to(item, {
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.95,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

updateCarousel();
setInterval(() => {
    currentSlide = (currentSlide + 1) % carouselItems.length;
    updateCarousel();
}, 5000);

document.querySelectorAll('.order-now').forEach(btn => {
    btn.addEventListener('click', () => {
        els.loginModal.classList.add('open');
        gsap.fromTo('.login-content', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    });
});

els.closeLogin.addEventListener('click', () => {
    gsap.to('.login-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => els.loginModal.classList.remove('open')
    });
});

els.loginModal.addEventListener('click', (e) => {
    if (e.target === els.loginModal) {
        gsap.to('.login-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => els.loginModal.classList.remove('open')
        });
    }
});

const loginTabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        loginTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loginForm.classList.toggle('active', tab.dataset.tab === 'login');
        signupForm.classList.toggle('active', tab.dataset.tab === 'signup');
    });
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) return alert('Please fill in all fields');
    alert('Login successful! (This is a demo)');
    els.loginModal.classList.remove('open');
    e.target.reset();
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (!name || !email || !password) return alert('Please fill in all fields');
    alert('Sign Up successful! (This is a demo)');
    els.loginModal.classList.remove('open');
    e.target.reset();
});

document.getElementById('theme-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-toggle').textContent = '☀️';
}

function animateOnScroll() {
    const viewportHeight = window.innerHeight;
    const items = [...els.stats, ...els.sustainItems, ...document.querySelectorAll('.product-card'), els.contactForm];
    items.forEach((item, index) => {
        if (!item.classList.contains('visible')) {
            const rect = item.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.9) {
                item.classList.add('visible');
                item.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });

    els.counters.forEach(counter => {
        if (!counter.dataset.animated && isInViewport(counter)) {
            animateCounter(counter);
        }
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    let count = 0;
    const increment = target / 50;
    const update = () => {
        if (count < target) {
            count += increment;
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
            counter.dataset.animated = 'true';
        }
    };
    update();
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight * 1.2;
}

window.addEventListener('scroll', animateOnScroll);

els.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !email || !message) return alert('Please fill in all fields');
    alert('Message sent! (This is a demo)');
    e.target.reset();
});

els.checkoutBtn.addEventListener('click', () => {
    if (store.cart.length === 0) return alert('Your cart is empty!');
    els.cartModal.classList.remove('open');
    els.paymentModal.classList.add('open');
    gsap.fromTo('.payment-content', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    animatePaymentMethods();
});

els.closePayment.addEventListener('click', () => {
    gsap.to('.payment-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => els.paymentModal.classList.remove('open')
    });
});

els.paymentModal.addEventListener('click', (e) => {
    if (e.target === els.paymentModal) {
        gsap.to('.payment-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => els.paymentModal.classList.remove('open')
        });
    }
});

function animatePaymentMethods() {
    const methods = els.paymentMethods.querySelectorAll('.payment-method');
    methods.forEach((method, index) => {
        gsap.from(method, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.out'
        });

        method.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-btn') || e.target.classList.contains('pay-btn')) return;
            const details = method.querySelector('.payment-details');
            const isActive = details.classList.contains('active');

            methods.forEach(m => m.querySelector('.payment-details').classList.remove('active'));
            if (!isActive) {
                details.classList.add('active');
                gsap.fromTo(details, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.5, ease: 'power2.out' });
            }
        });
    });
}

els.paymentMethods.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-btn')) {
        const details = e.target.closest('.payment-details');
        gsap.to(details, {
            opacity: 0,
            height: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => details.classList.remove('active')
        });
    }

    if (e.target.classList.contains('pay-btn')) {
        const method = e.target.dataset.method;
        let successMessage = '';
        switch (method) {
            case 'credit-card':
                const cardNumber = document.getElementById('card-number').value.trim();
                const expiry = document.getElementById('expiry').value.trim();
                const cvv = document.getElementById('cvv').value.trim();
                if (!cardNumber || !expiry || !cvv) return alert('Please fill in all fields');
                successMessage = 'Payment successful with Credit Card!';
                break;
            case 'paypal':
                successMessage = 'Redirecting to PayPal... (Demo)';
                break;
            case 'upi':
                const upiId = document.getElementById('upi-id').value.trim();
                if (!upiId) return alert('Please enter your UPI ID');
                successMessage = 'Payment successful with UPI!';
                break;
            case 'cod':
                successMessage = 'Order confirmed for Cash on Delivery!';
                break;
        }
        store.addOrder({ items: [...store.cart], total: store.getTotal(), method });
        alert(successMessage);
        store.clearCart();
        els.paymentModal.classList.remove('open');
        els.cartModal.classList.remove('open');
    }
});

// Admin Panel Functionality
function initAdminAuth() {
    const adminAuth = document.querySelector('.admin-auth');
    const adminAuthContent = document.querySelector('.admin-auth-content');
    const adminPassword = document.getElementById('admin-password');
    const adminAuthSubmit = document.getElementById('admin-auth-submit');
    const adminAuthError = document.querySelector('.admin-auth-error');
    const auth3D = document.querySelector('.admin-auth-3d');

    // Enhanced 3D lock animation setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(120, 120);
    auth3D.appendChild(renderer.domElement);

    // Create detailed lock
    const lockGroup = new THREE.Group();
    scene.add(lockGroup);

    // Main lock body with beveled edges
    const bodyGeometry = new THREE.CylinderBufferGeometry(1, 1, 0.5, 32, 2, false);
    const lockMaterial = new THREE.MeshPhongMaterial({
        color: document.body.classList.contains('dark') ? 0x4a9c6d : 0x2c6e49,
        specular: 0x777777,
        shininess: 50,
        metalness: 0.8,
        roughness: 0.2
    });
    const lockBody = new THREE.Mesh(bodyGeometry, lockMaterial);
    lockGroup.add(lockBody);

    // Animated shackle
    const points = [];
    for (let i = 0; i <= Math.PI; i += Math.PI / 30) {
        points.push(new THREE.Vector3(
            Math.cos(i) * 1.2,
            Math.sin(i) * 1.2 + 0.25,
            0
        ));
    }
    const shackleGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const shackleMaterial = new THREE.LineBasicMaterial({
        color: document.body.classList.contains('dark') ? 0x4a9c6d : 0x2c6e49,
        linewidth: 3
    });
    const shackle = new THREE.Line(shackleGeometry, shackleMaterial);
    lockGroup.add(shackle);

    // Enhanced lighting
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0x404040, 0.5));

    camera.position.z = 5;

    // Improved animation system
    let unlocking = false;
    let shakeAnimation = null;

    function animateLock() {
        requestAnimationFrame(animateLock);
        if (!unlocking) {
            lockGroup.rotation.y += 0.02;
            lockGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;
            shackle.scale.y = 1 + Math.sin(Date.now() * 0.003) * 0.02;
        }
        renderer.render(scene, camera);
    }
    animateLock();

    // Click outside to close
    adminAuth.addEventListener('click', (e) => {
        if (e.target === adminAuth) {
            window.location.href = '#home';
            adminAuth.classList.add('hidden');
        }
    });

    // Prevent click propagation from content
    adminAuthContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Enhanced submit button animation
    gsap.to(adminAuthSubmit, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // Input animations
    adminPassword.addEventListener('focus', () => {
        gsap.to(lockGroup.rotation, {
            y: lockGroup.rotation.y + Math.PI * 2,
            duration: 1,
            ease: "power2.inOut"
        });
    });

    function shakeLock() {
        if (shakeAnimation) shakeAnimation.kill();
        shakeAnimation = gsap.to(lockGroup.position, {
            x: [-0.3, 0.3, -0.2, 0.2, -0.1, 0.1, 0],
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Enhanced success/error handling
    adminAuthSubmit.addEventListener('click', () => {
        if (adminPassword.value === '0000') {
            unlocking = true;
            gsap.to(lockGroup.rotation, {
                y: Math.PI * 4,
                duration: 1.5,
                ease: "power4.inOut"
            });

            gsap.to(shackle.position, {
                y: 2,
                duration: 0.5,
                delay: 0.75,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(adminAuth, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            adminAuth.classList.add('hidden');
                            adminPassword.value = '';
                            adminAuthError.textContent = '';
                            unlocking = false;
                            shackle.position.y = 0;
                            lockGroup.position.set(0, 0, 0);
                        }
                    });
                }
            });
        } else {
            adminAuthError.textContent = 'Invalid password';
            adminAuthError.classList.add('show');
            shakeLock();
            gsap.from(adminAuthError, {
                scale: 0.5,
                opacity: 0,
                duration: 0.3,
                ease: "back.out(1.7)",
            });
            setTimeout(() => {
                adminAuthError.classList.remove('show');
            }, 2000);
        }
    });

    // Handle Enter key
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            adminAuthSubmit.click();
        }
    });

    return {
        show: () => {
            adminAuth.classList.remove('hidden');
            gsap.from(adminAuthContent, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
            adminPassword.focus();
        }
    };
}

const adminAuth = initAdminAuth();

[els.adminLink, els.adminFooterLink].forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        els.adminModal.classList.add('open');
        adminAuth.show();
        gsap.fromTo('.admin-content',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
    });
});

els.closeAdmin.addEventListener('click', () => {
    gsap.to('.admin-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => els.adminModal.classList.remove('open')
    });
});

els.adminModal.addEventListener('click', (e) => {
    if (e.target === els.adminModal) {
        gsap.to('.admin-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => els.adminModal.classList.remove('open')
        });
    }
});

const adminTabs = document.querySelectorAll('.admin-tab');
const adminSections = document.querySelectorAll('.admin-section');

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        adminSections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        const section = document.getElementById(`admin-${tab.dataset.tab}`);
        section.classList.add('active');
        gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    });
});

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    if (!name || !price || !image) return alert('Please fill in all fields');
    store.addProduct({ name, price, image });
    e.target.reset();
    alert('Product added successfully!');
});

document.getElementById('product-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        store.removeProduct(e.target.dataset.id);
    }
});

gsap.from('.navbar', { y: -100, duration: 0.8, ease: 'power2.out' });
gsap.from('.carousel-item.active', { opacity: 0, y: 50, duration: 0.8, delay: 0.2 });
gsap.from('.social-links a', {
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.social-links',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    }
});

// Add these new styles


// Add the new styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        document.body.appendChild(lazyLoadScript);
        lazyLoadScript.onload = function () {
            const observer = lozad();
            observer.observe();
        }
    }

    // Add error handling for images
    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = 'fallback-image.jpg'; // Replace with your fallback image
        });
    });

    // Handle newsletter subscription
    const newsletter = document.querySelector('.footer-newsletter');
    newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            e.target.reset();
        }
    });
});

// Format price to INR
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}