let oederAry = [];
const orderList = document.querySelector('.orderTableWrap tbody');
const deleteAllOrder = document.querySelector('.discardAllBtn');
deleteAllOrder.style.display = 'none';
const acesstoken={
  headers: {
  'Authorization': token
  }
}
//取得訂單來源資料
function getOrder() {
  ldld.on();
  axios.get(`${url_admin}/${api_path}/orders`, acesstoken)
    .then(function (response) {
      // handle success
      // console.log(response.data);
      oederAry = response.data.orders;
      showOrder(oederAry)
      c3v1();
      c3v2();
      ldld.off();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}
//渲染訂單資訊
function showOrder(data) {
  let str = '';
  let str2='';
  if (data.length == 0) {
    str = `<td colspan="8">目前無訂單資料</td>`;
    deleteAllOrder.style.display = 'none';
  }
  else {
    deleteAllOrder.style.display = 'block';
    // console.log(data[0].products);
    data.forEach(function (item) {
      item.products.forEach(function(products){
        str2+=`${products.title}*${products.quantity}<br>`
      })
      if(item.paid) item.paid='已處理'
      else{
        item.paid='未處理'
      }
      const timesTamp=new Date(item.createdAt*1000);//取得現在時間
      let year=timesTamp.getFullYear();
      let month=timesTamp.getMonth()+1;
      let date=timesTamp.getDate();
      if(month<10){
        month=`0${month}`
      }
      if(date<10){
        date=`0${date}`
      }
      const orderTime=`${year}/${month}/${date}`;
      str += `
          <tr>
              <td>${item.createdAt}</td>
              <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
              </td>
              <td>${item.user.address}</td>
              <td>${item.user.email}</td>
              <td>
                <p>${str2}</p>
              </td>
              <td>${orderTime}</td>
              <td class="orderStatus">
                <a href="#" data-id="${item.id}">${item.paid}</a>
              </td>
              <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
              </td>
          </tr>`
    })
  }

  orderList.innerHTML = str;
}

orderList.addEventListener('click', action);
deleteAllOrder.addEventListener('click', deleteAllOrders);
//改變訂單處理狀態
function changeOrder(orderId,status){
  axios.put(`${url_admin}/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": status
      }
    },acesstoken)
    .then(function (response) {
      // console.log(response.data);
      showOrder(response.data.orders);
      alert('訂單處理狀態已切換');
    })
}
//刪除全部訂單
function deleteAllOrders() {
  ldld.on();
  axios.delete(`${url_admin}/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      // console.log(response.data);
      oederAry = response.data.orders;
      showOrder(oederAry);
      c3v1();
      alert('全部訂單皆已刪除');
      deleteAllOrder.style.display = 'none';
      ldld.off();
    })
}
//判斷使用者選取行為
function action(e) {
  e.preventDefault();
  // console.log(e.target.textContent);
  let orderId = e.target.getAttribute('data-id');
  let status;
  // console.log(orderId);
  if (e.target.nodeName === 'INPUT') {
    deleteOrder(orderId);
  }
  else if(e.target.nodeName==='A'){
    if(e.target.textContent==='未處理'){
      status=true;
    }
    else{
      status=false;
    }
    changeOrder(orderId,status);
  }
  //刪除點擊到的訂單
  function deleteOrder(orderId){
    ldld.on();
    axios.delete(`${url_admin}/${api_path}/orders/${orderId}`,
    acesstoken)
    .then(function (response) {
      // console.log(response.data);
      oederAry = response.data.orders;
      showOrder(oederAry);
      c3v1();
      alert('該筆訂單已刪除');
      ldld.off();
    })
  }
}
function init() {
  getOrder();
}
init();

//渲染C3商品類別的資料
function c3v1(){
  //資料蒐集
  let obj={};
  oederAry.forEach(function(item){
    item.products.forEach(function(productItem){
      if(obj[productItem.category]===undefined){
        obj[productItem.category]=productItem.price*productItem.quantity;
      }
      else{
        obj[productItem.category]+=productItem.price*productItem.quantity
      }
    })
  })
  //組成C3格式資料
  let newAry = Object.keys(obj);
  // console.log(newAry);//['','','']
  let c3Data=[];
  newAry.forEach(function(item){
    let combination=[];
    combination.push(item);//[''],[''],['']
    // console.log(obj[item]);
    combination.push(obj[item]);//['',111],['',344],['',554]
    c3Data.push(combination)//[['',111],['',344],['',554]]
  })
  // console.log(c3Data);
  renderC3C(c3Data);
}

//渲染商品前3名及其他(第4名以後)販售資料
function c3v2(){
  //資料蒐集
  let obj={};
  oederAry.forEach(function(item){
    item.products.forEach(function(productItem){
      if(obj[productItem.title]===undefined){
        obj[productItem.title]=productItem.price*productItem.quantity;
      }
      else{
        obj[productItem.title]+=productItem.price*productItem.quantity
      }
    })
  })
  // console.log(obj);//{'':,'':,}
  let newAry = Object.keys(obj);
  // console.log(newAry);//['','','']
  //組成C3格式資料
  let c3Data=[];
  newAry.forEach(function(item){
    let combination=[];
    combination.push(item);//[''],[''],['']
    // console.log(obj[item]);
    combination.push(obj[item]);//['',111],['',344],['',554]
    c3Data.push(combination)//[['',111],['',344],['',554]]
  })
  // console.log(c3Data);
  c3Data.sort(function(a,b){
    return b[1]-a[1];
  })
  // console.log(c3Data.length);
  if(c3Data.length>3){
    let otherTotal=0;
    c3Data.forEach(function(item,i){
      if(i>2){
        otherTotal+=c3Data[i][1];
      }
    })
    c3Data.splice(3,c3Data.length-1);
    c3Data.push(['其他',otherTotal]);
  }
  renderC3R(c3Data);

}
//渲染C3資料

function renderC3C(c3Data){
  c3.generate({
    bindto: '#chart-C', // C3套件標籤綁定
    data: {
      type: "pie",
      columns: c3Data
    },
    size:{
      // width:549
    },
    color: 
      {
        pattern:["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
      }
  });
}
function renderC3R(c3Data){
  c3.generate({
    bindto: '#chart-R', // C3套件標籤綁定
    data: {
      type: "pie",
      columns: c3Data
    },
    size:{
      // width:549
    },
    color: 
      {
        pattern:["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
      }
  });
}