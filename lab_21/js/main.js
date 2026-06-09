let myProducts = JSON.parse(localStorage.getItem('products')) || [];

let modal = document.getElementById('productModal');
let openBtn = document.getElementById('openModalBtn');
let closeBtn = document.getElementById('closeModalBtn');
let form = document.getElementById('productForm');
let productsList = document.getElementById('productsList');

function showProducts() {
    if (myProducts.length === 0) {
        productsList.innerHTML = `<p class="empty-msg">No products yet......</p>`;
        return;
    }

    let cardsHtml = "";
    for (let i = 0; i < myProducts.length; i++) {
        let item = myProducts[i];
        cardsHtml += `
            <div class="product-card">
                <img src="${item.thumbnail}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="price-box">
                    <span>${item.price} $</span>
                    <i class="fa fa-trash delete-btn" onclick="removeProduct(${item.id})"></i>
                </div>
            </div>
        `;
    }
    productsList.innerHTML = cardsHtml;
}

function removeProduct(id) {
    let targetProduct = myProducts.find(item => item.id === id);

    if (!targetProduct) return;
    let agreement = confirm(`Do you realy want to remove ${targetProduct.title} element`);

    if (agreement) {
        myProducts = myProducts.filter(item => item.id !== id);
        localStorage.setItem('products', JSON.stringify(myProducts));
        showProducts();
    }
}

openBtn.onclick = function () {
    modal.style.display = 'flex';
};

closeBtn.onclick = function () {
    modal.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

form.onsubmit = function (event) {
    event.preventDefault();
    let newProduct = {
        id: Date.now(),
        title: document.getElementById('prodTitle').value,
        description: document.getElementById('prodDesc').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        discountPercentage: parseFloat(document.getElementById('prodDiscount').value),
        stock: parseInt(document.getElementById('prodStock').value) || 0,
        brand: document.getElementById('prodBrand').value || "No Brand",
        category: document.getElementById('prodCategory').value,
        thumbnail: document.getElementById('prodImage').value
    };

    myProducts.push(newProduct);

    localStorage.setItem('products', JSON.stringify(myProducts));

    showProducts();

    form.reset();
    modal.style.display = 'none';
};

showProducts();