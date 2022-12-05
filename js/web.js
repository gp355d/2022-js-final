let productAry=[];//ajax取回後儲存到的資料陣列
let cartAry=[];
let totalPrice=0;
const productList=document.querySelector('.productWrap');
const cartList=document.querySelector('.shoppingCart-table  tbody');
const cartListfooter=document.querySelector('.discardAllBtn');
const selectOption=document.querySelector('.productSelect');
const forms=document.querySelector('.orderInfo-form');
const inputs = document.querySelectorAll('input[type=text],input[type=tel],input[type=email],select');
const messages = document.querySelectorAll('[data-message]');
const totalPrices=document.querySelector('.total-price');
let customerInfo = document.querySelectorAll('.orderInfo-input');

//渲染商品資訊
function showProduct(data){
  let str='';
  data.forEach(function(item){
    str+=`<li class="productCard">
    <h4 class="productType">${item.category}</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
    <p class="nowPrice">NT$${toThousands(item.price)}</p>`;
  })
  productList.innerHTML=str;

}
//取得商品資料
function getProduct() {
  ldld.on();
  axios.get(`${url}/${api_path}/products`)
    .then(function (response) {
      // console.log(response.data);
      productAry=response.data.products;
      showProduct(productAry);
      getCategories();
      ldld.off();
    })
    .catch(function (error) {
      console.log(error);
    })
}
//取得購物車內的商品資料
function getCart(){
  axios.get(`${url}/${api_path}/carts`).
  then(function (response) {
    // console.log(response.data);
    cartAry=response.data.carts;
    totalPrice = response.data.finalTotal;
    showCart(cartAry,totalPrice);
  })
  .catch(function (error) {
    console.log(error);
  })
}
//渲染購物車內的商品資訊
function showCart(data,totalPrice){
  let str='';
  // console.log(data.length);
  if(data.length==0){
    str='<tr><td colspan="8">目前購物車內無商品</td></tr>';    
    totalPrice=0;
    cartListfooter.style.display='none';
    // return;
  }
  else{
    data.forEach(function(item){
      str+=`<tr>
      <td>
          <div class="cardItem-title">
              <img src="${item.product.images}" alt="">
              <p>${item.product.title}</p>
          </div>
      </td>
      <td>NT$${toThousands(item.product.price)}</td>
      <td class="editarea">
            <button style="padding:0;"class="numedit re">
              <span style="display:block;" class="material-icons cartAmount-icon" data-num="${item.quantity - 1}" data-id="${item.id}">remove
              </span>
            </button>
            <span>${item.quantity}</span>
            <button style="padding:0; class="numedit">
              <span style="display:block;" class="material-icons cartAmount-icon" data-num="${item.quantity + 1}" data-id="${item.id}">add
              </span>
            </button>
          </td>
      <td>NT$${toThousands(item.product.price*item.quantity)}</td>
      <td class="discardBtn">
          <a href="#" class="material-icons" data-id="${item.id}">
              clear
          </a>
      </td>
  </tr>
  `;
    })
    cartListfooter.style.display='block';
  };
  totalPrices.textContent=toThousands(totalPrice);
  cartList.innerHTML=str;
  
}
//將點擊到的商品加入購物車
function addCart(id){
  let num=1;
  cartAry.forEach(function(item){
    if(item.product.id===id){
      num=item.quantity+=1;
    }
  })
  ldld.on();
  axios.post(`${url}/${api_path}/carts`, {
    data: {
      productId: id,
      quantity: num
    }
  }).
  then(function (response) {
    totalPrice=response.data.finalTotal;
    cartAry=response.data.carts;
    showCart(cartAry,totalPrice);
    alert('該商品已經成功加入購物車內');
    ldld.off();

    })
    .catch(function (error) {
      console.log(error);
    })
}
//select標籤選項資料切換
selectOption.addEventListener('change',changeOption);
function changeOption(e){
  let optionItemAry=[];
  if(e.target.value==='全部'){
    optionItemAry=productAry;
  }
  else{
    productAry.forEach(function(item){
      if(e.target.value===item.category){
        optionItemAry.push(item)
      }
    })
  }
  showProduct(optionItemAry)
  // console.log(e.target.value)
}
//判斷g使用者選取行為
cartList.addEventListener('click',action);
function action(e){
  e.preventDefault();
  let cartId=e.target.getAttribute('data-id');
  let className = e.target.getAttribute('class');
  if(cartId == null){
    // console.log(num,cartId);
    return;
  }
  else if(className == "material-icons cartAmount-icon"){
    let num=Number(e.target.getAttribute('data-num'));
    editCartNum(num,cartId);
    return;
  }
  else{
    deleteItem(cartId);
  }
}
//刪除購物車內點擊到商品
function deleteItem(cartId){
  ldld.on();
  axios.delete(`${url}/${api_path}/carts/${cartId}`).
    then(function (response) {
      totalPrice=response.data.finalTotal;
      cartAry=response.data.carts;
      alert('該商品已經刪除');
      showCart(cartAry,totalPrice);
      ldld.off();
    })
    .catch(function(error){
      console.log(error);
    })
}
//編輯購物車內商品數量
function editCartNum(num,id){
  ldld.on();
  // console.log(num);
  if(num > 0) {
    axios.patch(`${url}/${api_path}/carts`,
    {
      data: {
        id: id,
        quantity: num
      }
    }).
    then(function (response) {
      totalPrice=response.data.finalTotal;
      cartAry=response.data.carts;
      showCart(cartAry,totalPrice);
      ldld.off();
    })
    .catch(function(error){
      console.log(error);
    })
    // ${url}/${api_path}/carts/}
  }
  else{
    alert("數量不能小於1")
    return;
  }
}
cartListfooter.addEventListener('click',deleteALLItem);
//刪除購物車內全部商品
function deleteALLItem(e){
  e.preventDefault();
  console.log(e.target);
  if(e.target.nodeName!=='A'){
    return;
  }
  ldld.on();
  axios.delete(`${url}/${api_path}/carts`).
    then(function (response) {
      // console.log(response.data);
      cartAry=response.data.carts;
      totalPrice = response.data.finalTotal;
      // console.log(cartAry,totalPrice);
      alert('購物車內全部商品皆已清空');
      showCart(cartAry,totalPrice);
      ldld.off();
    })
    .catch(function (error) {
      console.log(error);
    })
}
productList.addEventListener('click',addCartItem);
//將點擊的商品加入至購物車
function addCartItem(e){
  e.preventDefault();
  // console.dir(e.target.getAttribute('data-id'));
  if(e.target.nodeName!=='A'){
    return;
  }
  else{
    const productid =e.target.getAttribute('data-id');
    addCart(productid);
  }

}
//驗證表單規則
const constraints = {
  姓名:{
    presence:{
      message: "必填欄位"
    },
  },
  電話:{
    presence:{
      message: "必填欄位"
    },
    length: {
      minimum: 8,
      message: "號碼需超過 8 碼"
    }
  },
  Email:{
    presence: {
      message: "是必填欄位"
    },
    email: {
      message: "格式有誤"
    }
  },
  寄送地址:{
    presence: {
      message: "是必填欄位"
    }
  },
  交易方式:{
    presence: {
      message: "是必填欄位"
    },
  }

}
//建立訂單行為
function addOrder(){
  if(cartAry.length===0){
    alert('購物車內目前無選購產品');
    return;
  }
  let ary=[]
  customerInfo.forEach(function(item){
    ary.push(item.value);
  })
  axios.post(`${url}/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": ary[0],
          "tel": ary[1],
          "email": ary[2],
          "address": ary[3],
          "payment": ary[4]
        }
      }
    }
  )
  .then(function (response) {
      // console.log(response.data);
      forms.reset();
      alert('已成功建立訂單');
      getCart();
    })
    .catch(function(error){
      console.log(error.response.data);
    })
}
forms.addEventListener("submit", verification, false);
//驗證是否符合表單規則
function verification(e) {
  e.preventDefault();
  let errors = validate(forms, constraints);
  // 如果有誤，呈現錯誤訊息  
  if (errors) {
    showErrors(errors);
  } else {
    // 如果沒有錯誤，送出表單
    addOrder();
  }
}
//顯示表單驗證錯誤的回饋資訊
function showErrors(errors) {
  messages.forEach(function(item) {
    // console.log(item,errors);
    item.textContent = errors[item.dataset.message];
  })
}


function init() {
  getProduct();
  getCart();
}
init();

//篩選原始資料至select欄位
function getCategories() {
  //分類前資料 
  let unSort = productAry.map(function(item) {
     return item.category;
  });
  // console.log(unSort);//結果為["床架","床架","窗簾","床架","收納","床架","收納","床架"]
  //分類後資料
  let sorted = unSort.filter(function(item, i){
    return unSort.indexOf(item) === i;
  })
  // console.log(sorted);//結果為["床架","窗簾","收納"]
  //渲染至select標籤上
  renderCategories(sorted);
}
//將分類的資料渲染至select標籤的資料
function renderCategories(sorted) {
  let str = '<option value="全部" selected>全部</option>';
  sorted.forEach(function(item) {
    str += `<option value="${item}">${item}</option>`;
  })
  selectOption.innerHTML = str;
}

//數字的千分位驗證
function toThousands(x) {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}