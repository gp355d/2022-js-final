const api_path = "leo533";
const token = "XuK0KP4RkXR6ywFwzAvx7jPYBZg1";
const url="https://livejs-api.hexschool.io/api/livejs/v1/customer";
const url_admin="https://livejs-api.hexschool.io/api/livejs/v1/admin";
const ldld = new ldLoader({ root: ".my-loader" });
const acesstoken={
    headers: {
    'Authorization': token
    }
  }
//menu選單設定
const menuOpenBtn = document.querySelector('.menuToggle');
const linkBtn = document.querySelectorAll('.topBar-menu a');
const menu = document.querySelector('.topBar-menu');
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