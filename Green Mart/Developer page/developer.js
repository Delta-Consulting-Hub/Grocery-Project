// developer.js

// Handle form submission
document.getElementById('productForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const category = document.getElementById('productCategory').value;
  const imageURL = document.getElementById('productImageUrl').value;
  const description = document.getElementById('productDesc').value;

  // You can use this data for your testing or print it
  console.log("Submitted Product:", {
    name, price, category, imageURL, description
  });

  alert("Product Submitted!\n\n" +
        `Name: ${name}\n` +
        `Price: ₹${price}\n` +
        `Category: ${category}\n` +
        `Image URL: ${imageURL}\n` +
        `Description: ${description}`);

  this.reset(); // Clear the form after submission
});

const scriptURL = 'https://script.google.com/macros/s/AKfycbxGIBy-tDrony5FRFTshsCxM61I7nLCLcQcaTwsk5l2avpiRvLGqgdkD9KTv2cK1EYb/exec'
const form = document.forms['google-sheet']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => alert("Your Product is Successfully Added..."))
    .catch(error => console.error('Error!', error.message))
})