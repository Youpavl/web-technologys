let myProducts = [];

let modal = document.getElementById('productModal');
let openBtn = document.getElementById('openModalBtn');
let closeBtn = document.getElementById('closeModalBtn');
let form = document.getElementById('productForm');

let productsList = document.getElementById('productsList');

function renderProducts() {
    if (myProducts.length === 0) {
        productsList.innerHTML = `<p class="empty-msg">No products yet......</p>`;
        return;
    }

    let html = '';
    for (let i = 0; i < myProducts.length; i++) {
        let p = myProducts[i];
        html += `
            <div class="product-card">
                <img src="${p.thumbnail}" alt="${p.title}">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="price-box">
                    <span>${p.price} $</span>
                </div>
            </div>
        `;
    }

    productsList.innerHTML = html;
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
    console.log("Product added! Current list of products:", myProducts);

    renderProducts();

    form.reset();
    modal.style.display = 'none';
};