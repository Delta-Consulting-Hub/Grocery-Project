// Firebase Firestore setup (Ensure this part is already set up in your code)
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Initialize Firebase Firestore
const db = getFirestore(app);

// Cart-related variables
const cartItemsContainer = document.getElementById("cart-items");
const totalItemsEl = document.getElementById("total-items");
const subtotalEl = document.getElementById("subtotal");

// Fetch cart from Firestore
async function loadCart() {
  const userId = "userId"; // Replace with dynamic user identification (e.g., from Firebase Auth)
  const cartRef = doc(db, "carts", userId);  // Using userId as document ID
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const cart = cartDoc.data().items || [];
    renderCart(cart);
  } else {
    renderCart([]);
  }
}

// Render cart items
function renderCart(cart) {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "0.00";
    totalItemsEl.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>Price: ₹${item.price}</p>
        <div class="cart-actions">
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
        </div>
        <p>Total: ₹${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  updateSummary(cart);
}

// Update summary (total items and subtotal)
function updateSummary(cart) {
  let totalItems = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;
  });

  totalItemsEl.textContent = totalItems;
  subtotalEl.textContent = subtotal.toFixed(2);

  // Save the updated cart in Firestore
  saveCart(cart);
}

// Change quantity of an item in the cart
async function changeQuantity(index, delta) {
  const userId = "userId"; // Replace with dynamic user identification (e.g., from Firebase Auth)
  const cartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(cartRef);
  const cart = cartDoc.exists() ? cartDoc.data().items : [];

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  renderCart(cart);
  updateSummary(cart);
}

// Remove an item from the cart
async function removeItem(index) {
  const userId = "userId"; // Replace with dynamic user identification (e.g., from Firebase Auth)
  const cartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(cartRef);
  const cart = cartDoc.exists() ? cartDoc.data().items : [];

  cart.splice(index, 1);
  renderCart(cart);
  updateSummary(cart);
}

// Save the cart to Firestore
async function saveCart(cart) {
  const userId = "userId"; // Replace with dynamic user identification (e.g., from Firebase Auth)
  const cartRef = doc(db, "carts", userId);

  await setDoc(cartRef, {
    items: cart
  }, { merge: true }); // Merge ensures that other data (like user data) is not overwritten
}

// Proceed to checkout page
function proceedToPay() {
  window.location.href = "Checkout/pay.html";
}

// Initial call to load the cart when the page loads
loadCart();
