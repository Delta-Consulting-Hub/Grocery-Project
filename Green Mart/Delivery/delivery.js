function saveDeliverySettings() {
    const minFreeDelivery = document.getElementById('min-free-delivery').value;
    const below100Delivery = document.getElementById('below-100-delivery').value;
    const below200Delivery = document.getElementById('below-200-delivery').value;
  
    if (minFreeDelivery === '' || below100Delivery === '' || below200Delivery === '') {
      document.getElementById('save-status').textContent = 'Please fill all fields!';
      document.getElementById('save-status').style.color = 'red';
      return;
    }
  
    const deliverySettings = {
      minFreeDelivery: parseFloat(minFreeDelivery),
      below100Delivery: parseFloat(below100Delivery),
      below200Delivery: parseFloat(below200Delivery)
    };
  
    localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));
    document.getElementById('save-status').textContent = 'Settings saved successfully!';
    document.getElementById('save-status').style.color = 'green';
  }
  