let myProducts = [];

let modal = document.getElementById('productModal');
let openBtn = document.getElementById('openModalBtn');
let closeBtn = document.getElementById('closeModalBtn');
let form = document.getElementById('productForm');
let productsList = document.getElementById('productsList');

let searchInput = document.getElementById('searchInput');
let filterCategory = document.getElementById('filterCategory');
let sortSelect = document.getElementById('sortSelect');
let startContainer = document.getElementById('startContainer');

function showProducts(productsArray = myProducts) {
    if (productsArray.length === 0) {
        productsList.innerHTML = `<p class=\"empty-msg\">No products found...</p>`;
        return;
    }

    let cardsHtml = "";
    for (let i = 0; i < productsArray.length; i++) {
        let item = productsArray[i];
        cardsHtml += `
            <div class=\"product-card\">
                <img src="${item.thumbnail}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class=\"price-box\">
                    <span>${item.price} $</span>
                    <i class=\"fa fa-trash delete-btn\" onclick=\"removeProduct(${item.id})\"></i>
                </div>
            </div>
        `;
    }
    productsList.innerHTML = cardsHtml;
}
async function fetchProductsFromServer() {
    try {
        startContainer.innerHTML = "<p style='text-align:center; font-size:18px;'>Loading products...</p>";
        let response = await fetch('https://dummyjson.com/products?limit=100&skip=0');
        let data = await response.json();

        myProducts = data.products.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            discountPercentage: item.discountPercentage || 0,
            stock: item.stock || 0,
            brand: item.brand || "No Brand",
            category: item.category,
            thumbnail: item.thumbnail
        }));

        localStorage.setItem('products', JSON.stringify(myProducts));
        startContainer.innerHTML = "";
        applyFilters();

    } catch (error) {
        startContainer.innerHTML = `<p style='color:red; text-align:center;'>Error loading data: ${error.message}</p>`;
    }
}

function initApp() {
    let localData = localStorage.getItem('products');

    if (!localData || JSON.parse(localData).length === 0) {
        startContainer.innerHTML = `<button id="startBtn" class="start-btn">start</button>`;
        document.getElementById('startBtn').onclick = fetchProductsFromServer;
        showProducts([]);
    } else {
        myProducts = JSON.parse(localData);
        startContainer.innerHTML = "";
        applyFilters();
    }
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

openBtn.onclick = function () { modal.style.display = 'flex'; };
closeBtn.onclick = function () { modal.style.display = 'none'; };
window.onclick = function (event) { if (event.target === modal) { modal.style.display = 'none'; } };

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

initApp();