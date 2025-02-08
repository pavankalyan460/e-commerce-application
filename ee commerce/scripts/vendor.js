
const vendorSection = document.getElementById('vendor-section');
const addProductForm = document.getElementById('add-product-form');
const vendorProductList = document.getElementById('vendor-product-list');

let editingProductId = null; // Track product being edited

// Show Vendor Section
document.getElementById('vendor-view').addEventListener('click', () => {
  document.getElementById('user-section').classList.add('hidden');
  vendorSection.classList.remove('hidden');
  displayVendorProducts();
});

// Add or Update Product (Handles Image Upload)
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const file = document.getElementById('product-image').files[0];

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert image to Base64
    reader.onload = function (event) {
      saveProduct(event.target.result); // Store the Base64 string
    };
  } else {
    saveProduct(null);
  }
});

// Function to Save or Update Product
function saveProduct(imageData) {
  const products = getFromLocalStorage('products');

  const product = {
    id: editingProductId || Date.now(),
    title: document.getElementById('product-title').value,
    description: document.getElementById('product-description').value,
    price: parseFloat(document.getElementById('product-price').value),
    category: document.getElementById('product-category').value,
    image: imageData || (editingProductId ? products.find(p => p.id === editingProductId).image : 'placeholder.jpg'),
  };

  if (editingProductId) {
    // Update existing product
    const index = products.findIndex(p => p.id === editingProductId);
    products[index] = product;
    editingProductId = null; // Reset edit mode
  } else {
    // Add new product
    products.push(product);
  }

  saveToLocalStorage('products', products);
  addProductForm.reset();
  displayVendorProducts();
}

// Display Vendor Products (With Edit & Delete)
function displayVendorProducts() {
  const products = getFromLocalStorage('products');

  vendorProductList.innerHTML = products.map(product => `
    <div class="product">
      <img src="${product.image}" alt="${product.title}" style="max-width: 100px; height: auto;" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <button onclick="editProduct(${product.id})">Edit</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    </div>
  `).join('');
}

// Edit Product
window.editProduct = function (id) {
  const products = getFromLocalStorage('products');
  const product = products.find(p => p.id === id);
  if (!product) return;

  // Fill the form with existing product data
  document.getElementById('product-title').value = product.title;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-category').value = product.category;
  
  editingProductId = id; // Set edit mode
};

// Delete Product
window.deleteProduct = function (id) {
  let products = getFromLocalStorage('products');
  products = products.filter(product => product.id !== id);
  saveToLocalStorage('products', products);
  displayVendorProducts();
};

// Save & Get Data from LocalStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
