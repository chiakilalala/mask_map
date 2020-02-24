//1.指定 dom 

let send = document.querySelector('.send');
let list = document.querySelector('.list');
let text = document.querySelector('.text');
let data = JSON.parse(localStorage.getItem('todolist')) || [];



function addTodo(e) {
    e.preventDefault();
    let text = document.querySelector('.text').value;
    let todo = {
        todolist: text
    }
    data.push(todo);
    update(data);
    localStorage.setItem('todolist', JSON.stringify(data));

}

function update(data) {
    var str = '';
    for (let i = 0; i < data.length; i++) {
        str += `<li>
        <a href="#" data-num="${i}"> 刪除</a>
        <span> ${data[i].todolist} </span> </li>`
    }
    list.innerHTML = str;
}

function toggleData(e) {

    // 使用dataset 取得屬性資料
    var num = e.target.dataset.num;
    console.log(num);
    if (e.target.nodeName !== 'A') {
        return;
    }
    data.splice(num, 1);

    update(data);

}

send.addEventListener('click', addTodo);
list.addEventListener('click', toggleData);


// let send = document.querySelector('.send');
// //產生資料的地方
// let list = document.querySelector('.list');
// let text = document.querySelector('.text');
// let data =  JSON.parse(localStorage.getItem("todolist"))||[];

// function addTodo(e) {
//     e.preventDefault();
//     // text.value = alert("123");

//     let todo = {
//         item: text.value
//     }
//     data.push(todo);
//     updated(data);
//     //資料存進localStorage
//     localStorage.setItem('todolist', JSON.stringify(data));

// }

// function updated(data) {
//     let len = data.length;
//     let str = '';
//     data.forEach((x) => {
//         str += `<li>
//         <a href="#" data-num="${x}"> 刪除</a>
//         <span> ${data[x].item} </span> </li>`
//     });
//     // for (var i = 0; i < len; i++) {
//     //     str += `<li><a href="#" data-num="${i}"> 刪除</a>
//     //          <span> ${data[i].item} </span> </li>`;
//     list.innerHTML = str;
// };



// send.addEventListener('click', addTodo);

// let text = document.querySelector('.text');
// let send = document.querySelector('.send');
// // 這是資料喔！localStorage 都是字串轉乘 我們是要array 所以需要JSON.parse()
// let data = [] || JSON.parse(localStorage.getItem("myItem"));
// let list = document.querySelector('.list');



// 資料更新刪除


// 加入列表，並同時更新網頁及localStorage

// function addData(e) {
//     e.preventDefault;
//     // 找到localStorage 存入 裡面的值 使用setItem()
//     // 撈出輸入鍵的值
//     let text = document.querySelector('.text').value;
//     // 因為要把輸入的值變成 陣列 所以製作一個空物件 
//     let todo = {
//             myItem: text
//         }
//         //在一開始的資料宣告let data （array） 塞進東西
//         // 建立一個物件，之後新增的檔案會存放在此
//     data.push(todo);
//     updateList(data);
//     // 存在Localstoreage
//     localStorage.setItem('myItem', JSON.stringify(data));
// };



//更新資料
// function updateList(data) {
//     let len = data.length;
//     let str = '';
//     for (let i = 0; i < len; i++) {
//         str += `<li>
//             <a href="#" data-num =${i}>刪除</a> <span>${data[i].myItem}  </span>  </li>`;
//     }
//     list.innerHTML = str;
// }
//刪除事項
// function toggleData(e) {
//     e.preventDefault;
//     // 撈出檔案第i筆or 第二筆資料
//     var num = e.target.dataset.num;
//     console.log(num);
//     // 針對鎖定的li部分下此指令if(listli !=="LI"){return},以作為一個中斷點
//     if (e.target.nodeName !== "A") { return };
//     // 利用js的splice()刪除array 功能
//     data.splice(num, 1);
//     //刪除資料、讓💾在重新更新
//     updateList(data);


// }
//使用者進行點擊行為 進行資料更新
// send.addEventListener('click', addData);
// list.addEventListener('click', toggleData);
// 使用localStorage 取直然後放到頁面

//更新資料


// //指定 dom
// const list = document.querySelector('.list');
// const sendData = document.querySelector('.send');
// const data = JSON.parse(localStorage.getItem('listData')) || [];
// //監聽更新

// sendData.addEventListener('click',addData)
//   list.addEventListener('click', toggleDone);
//     updateList(data);






// //加入介面 同步更新網頁 localstorage

// function addData(e) { //增加代辦事件
//       e.preventDefault();
//   var text = document.querySelector('.text').value; //找到字的value
//   var todo = {
//     content:text
//   };
//   data.push(todo);
//   updateList(data);//更新
//   localStorage.setItem('listData',JSON.stringify(data));
// }
// //更新網頁內容

// function updateList(items) {
//   str ='';
//   let len = items.length;
//   for (let i = 0; len >i; i++) {
//    str += '<li><a href="#" data-index='+i+'/> X</a></span>' + items[i].content + '</span></li>';
//    }
//    list.innerHTML = str;
//  }
//  //刪除事項
//  function toggleDone(e) {
//     e.preventDefault();
//     if(e.target.nodeName !== 'A'){
//       return
//     };
//     var index =e.target.dataset.index;
//     data.splice(index,1);
//     localStorage.setItem('listData',JSON.stringify(data));
//     updateList(data);
//  }