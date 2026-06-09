let burgerBtn = document.getElementById('burgerBtn');
let navMenu = document.getElementById('navMenu');

burgerBtn.onclick = function (event) {
    navMenu.classList.toggle('show');
    event.stopPropagation();
};

document.onclick = function (event) {
    if (navMenu.classList.contains('show') && !navMenu.contains(event.target)) {
        navMenu.classList.remove('show');
    }
};