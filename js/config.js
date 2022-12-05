const api_path = "leo533";
const token = "XuK0KP4RkXR6ywFwzAvx7jPYBZg1";
const url="https://livejs-api.hexschool.io/api/livejs/v1/customer";
const url_admin="https://livejs-api.hexschool.io/api/livejs/v1/admin";
let ldld = new ldLoader({ root: ".my-loader" });
//menu選單設定
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
    } else {
    menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}