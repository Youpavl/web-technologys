// GET-запит на маршрут “/product/list”
document.getElementById('getProductsBtn').onclick = function() {
    fetch('/product/list')
        .then(response => response.json())
        .then(data => console.log('GET /product/list success:', data))
        .catch(err => console.error('Error GET request:', err));
};

// POST-запит на маршрут "/product/create" (Передача об'єкта)
document.getElementById('postProductBtn').onclick = function() {
    let productData = {
        title: "MacBook Pro 14 2025 24GB RAM",
        category: "laptops",
        price: 1999.99
    };

    fetch('/product/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => console.log('POST /product/create success:', data))
    .catch(err => console.error('Error POST request:', err));
};

// PUT-запит на маршрут "/product/:id"
document.getElementById('putProductBtn').onclick = function() {
    let updatedPrice = {
        price: 1899.99
    };
    let productId = '0010506';

    fetch(`/product/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPrice)
    })
    .then(response => response.json())
    .then(data => console.log(`PUT /product/${productId} success:`, data))
    .catch(err => console.error('Error PUT request:', err));
};

// DELETE-запит з id продукту на маршрут “/product/id”
document.getElementById('deleteProductBtn').onclick = function() {
    let productId = '0010506';

    fetch(`/product/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log(`DELETE /product/${productId} success:`, data))
    .catch(err => console.error('Error DELETE request:', err));
};