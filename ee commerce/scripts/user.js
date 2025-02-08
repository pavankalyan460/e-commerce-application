const userSection = document.getElementById('user-section');
const userProductList = document.getElementById('user-product-list');
const cart = document.getElementById('cart');
const checkoutButton = document.getElementById('checkout');
const orderHistory = document.getElementById('order-history');

// Show User Section
document.getElementById('user-view').addEventListener('click', () => {
  document.getElementById('vendor-section').classList.add('hidden');
  userSection.classList.remove('hidden');
  displayUserProducts();
  displayCart();
  displayOrderHistory();
});

// Display User Products
function displayUserProducts() {
    const products = getFromLocalStorage('products');
    const selectedCategory = document.getElementById('category-filter').value;
  
    const filteredProducts = selectedCategory === "all" 
      ? products 
      : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
  
    userProductList.innerHTML = filteredProducts.map(product => `
      <div class="product">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `).join('');
  }
  
  // Apply filter when category is changed
  document.getElementById('category-filter').addEventListener('change', displayUserProducts);
  
  

// Add to Cart
window.addToCart = function (id) {
  const products = getFromLocalStorage('products');
  const product = products.find(p => p.id === id);
  let cartItems = getFromLocalStorage('cart');
  cartItems.push(product);
  saveToLocalStorage('cart', cartItems);
  displayCart();
};

// Display Cart
function displayCart() {
  const cartItems = getFromLocalStorage('cart');
  cart.innerHTML = cartItems.map(item => `
    <div class="product">
      <h3>${item.title}</h3>
      <p>$${item.price}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join('');
}

// Remove from Cart
window.removeFromCart = function (id) {
  let cartItems = getFromLocalStorage('cart');
  cartItems = cartItems.filter(item => item.id !== id);
  saveToLocalStorage('cart', cartItems);
  displayCart();
};

// Checkout
checkoutButton.addEventListener('click', () => {
  const cartItems = getFromLocalStorage('cart');
  if (cartItems.length === 0) return alert('Cart is empty!');
  const transaction = {
    id: Date.now(),
    products: cartItems,
    timestamp: new Date().toISOString(),
  };
  const transactions = getFromLocalStorage('transactions');
  transactions.push(transaction);
  saveToLocalStorage('transactions', transactions);
  saveToLocalStorage('cart', []);
  displayCart();
  displayOrderHistory();
});

// Display Order History
function displayOrderHistory() {
  const transactions = getFromLocalStorage('transactions');
  orderHistory.innerHTML = transactions.map(transaction => `
    <div class="transaction">
      <p>Order ID: ${transaction.id}</p>
      <p>Date: ${new Date(transaction.timestamp).toLocaleString()}</p>
      <ul>
        ${transaction.products.map(product => `<li>${product.title} - $${product.price}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}