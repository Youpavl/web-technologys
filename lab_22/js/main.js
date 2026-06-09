let myProducts = JSON.parse(localStorage.getItem('products')) || [];

let modal = document.getElementById('productModal');
let openBtn = document.getElementById('openModalBtn');
let closeBtn = document.getElementById('closeModalBtn');
let form = document.getElementById('productForm');
let productsList = document.getElementById('productsList');

let searchInput = document.getElementById('searchInput');
let filterCategory = document.getElementById('filterCategory');
let sortSelect = document.getElementById('sortSelect');

function showProducts(productsArray = myProducts) {
    if (productsArray.length === 0) {
        productsList.innerHTML = `<p class="empty-msg">No products found...</p>`;
        return;
    }

    let cardsHtml = "";
    for (let i = 0; i < productsArray.length; i++) {
        let item = productsArray[i];
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


function applyFilters() {
    let filteredProducts = [...myProducts];

    let categoryValue = filterCategory.value;
    if (categoryValue !== 'all') {
        filteredProducts = filteredProducts.filter(item => item.category === categoryValue);
    }

    let searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue !== "") {
        filteredProducts = filteredProducts.filter(item =>
            item.title.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue)
        );
    }

    let sortValue = sortSelect.value;
    if (sortValue === 'priceAsc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'priceDesc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'newest') {
        filteredProducts.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'oldest') {
        filteredProducts.sort((a, b) => a.id - b.id);
    }
    showProducts(filteredProducts);
}

searchInput.addEventListener('input', applyFilters);
filterCategory.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
function removeProduct(id) {
    let targetProduct = myProducts.find(item => item.id === id);

    if (!targetProduct) return;
    let agreement = confirm(`Do you really want to remove ${targetProduct.title}?`);

    if (agreement) {
        myProducts = myProducts.filter(item => item.id !== id);
        localStorage.setItem('products', JSON.stringify(myProducts));
        applyFilters();
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

    form.reset();
    modal.style.display = 'none';
    applyFilters();
};

applyFilters();