// ----------- 24 Products -----------
const products = [
  { id: 1, name: "Wireless Headphones", price: 60, img: "https://picsum.photos/seed/p1/400/300" },
  { id: 2, name: "Smart Watch", price: 120, img: "https://picsum.photos/seed/p2/400/300" },
  { id: 3, name: "Bluetooth Speaker", price: 45, img: "https://picsum.photos/seed/p3/400/300" },
  { id: 4, name: "Gaming Mouse", price: 30, img: "https://picsum.photos/seed/p4/400/300" },
  { id: 5, name: "Mechanical Keyboard", price: 85, img: "https://picsum.photos/seed/p5/400/300" },
  { id: 6, name: "LED Monitor", price: 220, img: "https://picsum.photos/seed/p6/400/300" },
  { id: 7, name: "USB-C Charger", price: 25, img: "https://picsum.photos/seed/p7/400/300" },
  { id: 8, name: "Laptop Stand", price: 40, img: "https://picsum.photos/seed/p8/400/300" },
  { id: 9, name: "External Hard Drive", price: 99, img: "https://picsum.photos/seed/p9/400/300" },
  { id: 10, name: "Portable SSD", price: 150, img: "https://picsum.photos/seed/p10/400/300" },
  { id: 11, name: "Desk Lamp", price: 35, img: "https://picsum.photos/seed/p11/400/300" },
  { id: 12, name: "Wireless Mouse", price: 20, img: "https://picsum.photos/seed/p12/400/300" },
  { id: 13, name: "Power Bank", price: 50, img: "https://picsum.photos/seed/p13/400/300" },
  { id: 14, name: "Smartphone Tripod", price: 25, img: "https://picsum.photos/seed/p14/400/300" },
  { id: 15, name: "Phone Case", price: 15, img: "https://picsum.photos/seed/p15/400/300" },
  { id: 16, name: "Fitness Band", price: 70, img: "https://picsum.photos/seed/p16/400/300" },
  { id: 17, name: "Camera Lens", price: 250, img: "https://picsum.photos/seed/p17/400/300" },
  { id: 18, name: "Drone", price: 350, img: "https://picsum.photos/seed/p18/400/300" },
  { id: 19, name: "Smart Glasses", price: 280, img: "https://picsum.photos/seed/p19/400/300" },
  { id: 20, name: "VR Headset", price: 400, img: "https://picsum.photos/seed/p20/400/300" },
  { id: 21, name: "Microphone", price: 90, img: "https://picsum.photos/seed/p21/400/300" },
  { id: 22, name: "Wireless Router", price: 60, img: "https://picsum.photos/seed/p22/400/300" },
  { id: 23, name: "Projector", price: 200, img: "https://picsum.photos/seed/p23/400/300" },
  { id: 24, name: "Webcam", price: 75, img: "https://picsum.photos/seed/p24/400/300" }
];

// ----------- Page Navigation -----------
const pages = document.querySelectorAll('.page');
function showPage(id) {
  pages.forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

document.getElementById('homeLink').onclick = () => showPage('home');
document.getElementById('productsLink').onclick = () => showPage('products');
document.getElementById('cartLink').onclick = () => showPage('cart');
document.getElementById('loginLink').onclick = () => showPage('login');
document.getElementById('registerLink').onclick = () => showPage('register');

// ----------- Registration -----------
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = regName.value;
  const email = regEmail.value.toLowerCase();
  const password = regPassword.value;

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) return alert('User already exists!');

  users[email] = { name, email, password };
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! You can now login.');
  showPage('login');
});

// ----------- Login -----------
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = loginEmail.value.toLowerCase();
  const password = loginPassword.value;

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[email];
  if (!user || user.password !== password) return alert('Invalid email or password!');

  localStorage.setItem('currentUser', JSON.stringify(user));
  alert('Login successful!');
  document.getElementById('logoutBtn').classList.remove('hidden');
  document.getElementById('loginLink').classList.add('hidden');
  document.getElementById('registerLink').classList.add('hidden');
  showPage('home');
  loadCart();
});

// ----------- Logout -----------
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('loginLink').classList.remove('hidden');
  document.getElementById('registerLink').classList.remove('hidden');
  updateCartCount(0);
  alert('Logged out!');
  showPage('home');
});

// ----------- Product Display -----------
const productList = document.getElementById('productList');
products.forEach(p => {
  const div = document.createElement('div');
  div.classList.add('product');
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h3>${p.name}</h3>
    <p>Price: $${p.price}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  `;
  productList.appendChild(div);
});

// ----------- Cart Management -----------
function getCartKey() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user ? `cart_${user.email}` : null;
}

function loadCart() {
  const key = getCartKey();
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';

  if (!key) {
    cartItemsDiv.innerHTML = '<p>Please login to view your cart.</p>';
    updateCartCount(0);
    return;
  }

  let cart = JSON.parse(localStorage.getItem(key) || '[]');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <p>${item.name} - $${item.price} × ${item.qty}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItemsDiv.appendChild(div);
    });
  }

  updateCartCount(cart.reduce((a, c) => a + c.qty, 0));
}

function addToCart(id) {
  const key = getCartKey();
  if (!key) return alert('Please login first to add items to your cart.');

  const cart = JSON.parse(localStorage.getItem(key) || '[]');
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem(key, JSON.stringify(cart));
  alert('Product added to cart!');
  loadCart();
}

// ----------- Remove Individual Product from Cart -----------
function removeFromCart(id) {
  const key = getCartKey();
  if (!key) return;

  let cart = JSON.parse(localStorage.getItem(key) || '[]');
  cart = cart.filter(item => item.id !== id); // Remove the selected product
  localStorage.setItem(key, JSON.stringify(cart));
  loadCart(); // Refresh cart display
}

// ----------- Cart Counter -----------
function updateCartCount(count) {
  document.getElementById('cartCount').innerText = count;
}

// Initialize cart count on page load
window.onload = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('loginLink').classList.add('hidden');
    document.getElementById('registerLink').classList.add('hidden');
    loadCart();
  } else {
    updateCartCount(0);
  }
};
