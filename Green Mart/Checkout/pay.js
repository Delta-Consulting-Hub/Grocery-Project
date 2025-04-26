document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const town = document.getElementById("userTown").value.trim();

    if (name && phone.length === 10 && town) {
      document.getElementById("cartSection").classList.remove("hidden");
      loadCart();
    } else {
      alert("Please fill all fields correctly.");
    }
  });

  document.getElementById("codBtn").addEventListener("click", () => processPayment("Cash on Delivery"));
  document.getElementById("phonepeBtn").addEventListener("click", () => processPayment("PhonePe"));
});

let cartItems = [];
let total = 0;

function loadCart() {
  cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";
  total = 0;

  cartItems.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<p><strong>${item.name}</strong> x ${item.quantity} — ₹${lineTotal}</p>`;
    cartDiv.appendChild(div);
  });

  const delivery = total < 100 ? 15 : (total < 300 ? 10 : 0);
  const totalPrice = total + delivery;

  document.getElementById("productPrice").textContent = total;
  document.getElementById("deliveryCharge").textContent = delivery;
  document.getElementById("totalAmount").textContent = totalPrice;
}

async function processPayment(method) {
  const name = document.getElementById("userName").value;
  const phone = document.getElementById("userPhone").value;
  const town = document.getElementById("userTown").value;

  let orderDetails = "";
  cartItems.forEach(item => {
    orderDetails += `${item.quantity}x ${item.name} — ₹${item.price * item.quantity}\n`;
  });

  const productPrice = parseInt(document.getElementById("productPrice").textContent);
  const deliveryCharges = parseInt(document.getElementById("deliveryCharge").textContent);
  const totalPrice = parseInt(document.getElementById("totalAmount").textContent);

  const payload = {
    name,
    phone,
    town,
    orderDetails,
    productPrice,
    deliveryCharges,
    totalPrice
  };

  // Send data to Google Sheets
  await fetch("YOUR_GOOGLE_SCRIPT_DEPLOYMENT_URL", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });

  // PhonePe flow
  if (method === "PhonePe") {
    const upiId = "9921352767@ybl";
    const name = "Delta Grocery";
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${totalPrice}&cu=INR`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      alert(`Opening PhonePe to pay ₹${totalPrice}`);
      window.location.href = upiLink;
    } else {
      const qr = document.getElementById("qrContainer");
      qr.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=250x250" />
        <p><strong>Scan QR to pay ₹${totalPrice}</strong></p>
      `;
    }
  } else {
    alert("Order placed with Cash on Delivery!");
    localStorage.removeItem("cart");
    window.location.href = "/Shop page/shop.html";
  }
}
