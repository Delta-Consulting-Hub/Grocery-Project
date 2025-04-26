import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firestore setup
const db = getFirestore(app);

async function loadOrders() {
  const paymentFilter = document.getElementById("paymentFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;
  const container = document.getElementById("ordersContainer");

  container.innerHTML = "";

  const ordersSnapshot = await getDocs(collection(db, "orders"));
  const orders = [];

  ordersSnapshot.forEach(doc => {
    orders.push(doc.data());
  });

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp).toISOString().split("T")[0];
    const matchesPayment = paymentFilter === "All" || order.paymentMethod === paymentFilter;
    const matchesDate = !dateFilter || orderDate === dateFilter;
    return matchesPayment && matchesDate;
  });

  if (filteredOrders.length === 0) {
    container.innerHTML = "<p>No orders found for this filter.</p>";
    return;
  }

  filteredOrders.forEach((order, index) => {
    const div = document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML = `
      <div class="left">
        <span><strong>#${index + 1}</strong></span>
        <span>${order.user.name}</span>
        <span>${order.user.phone}</span>
        <span>${order.timestamp}</span>
      </div>
      <div class="right">
        <span>${order.paymentMethod}</span>
        <span>₹${order.total}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// Load today's orders by default
window.onload = function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateFilter").value = today;
  loadOrders();
};

// Attach change events
document.getElementById("paymentFilter").addEventListener("change", loadOrders);
document.getElementById("dateFilter").addEventListener("change", loadOrders);
