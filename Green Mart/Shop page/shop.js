import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firestore setup
const db = getFirestore(app);

function togglePriceFilter() {
  const box = document.getElementById("price-range-box");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

function applyPriceFilter() {
  const min = parseFloat(document.getElementById("min-price").value) || 0;
  const max = parseFloat(document.getElementById("max-price").value) || Infinity;
  const allProducts = document.querySelectorAll(".product-card");

  allProducts.forEach(card => {
    const price = parseFloat(card.getAttribute("data-price"));
    card.style.display = (price >= min && price <= max) ? "block" : "none";
  });
}

function openPopup(product) {
  document.getElementById("popup-img").src = product.image;
  document.getElementById("popup-name").textContent = product.name;
  document.getElementById("popup-price").textContent = "₹" + product.price;
  document.getElementById("popup-description").textContent = product.description || "No description available";
  document.getElementById("product-popup").style.display = "flex";

  document.getElementById("quantityValue").textContent = 1;
  window.currentProduct = product; // Save for use in cart
}

function closePopup() {
  document.getElementById("product-popup").style.display = "none";
}

// Load products from Firestore on page load
window.onload = async function () {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  const productsSnapshot = await getDocs(collection(db, "products"));
  const products = [];

  productsSnapshot.forEach(doc => {
    const product = doc.data();
    product.id = doc.id;
    products.push(product);
  });

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.setAttribute("data-price", product.price);

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
    `;

    div.onclick = () => openPopup(product);
    container.appendChild(div);
  });

  // Save for cart lookup later
  window.loadedProducts = products;
};

// Quantity buttons
document.getElementById("decreaseQty").addEventListener("click", function () {
  let quantity = parseInt(document.getElementById("quantityValue").textContent);
  if (quantity > 1) {
    document.getElementById("quantityValue").textContent = quantity - 1;
  }
});

document.getElementById("increaseQty").addEventListener("click", function () {
  let quantity = parseInt(document.getElementById("quantityValue").textContent);
  document.getElementById("quantityValue").textContent = quantity + 1;
});

function addToCart(product) {
  const quantity = parseInt(document.getElementById("quantityValue").textContent);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

document.getElementById("confirmAddToCart").addEventListener("click", function () {
  if (window.currentProduct) {
    addToCart(window.currentProduct);
    alert(`${window.currentProduct.name} added to cart!`);
    closePopup();
  }
});
