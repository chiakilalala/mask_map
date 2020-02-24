var recordLen = records.length; //JSON長度
var el_hotarea = document.querySelector('.wrapper'); //點擊熱門

//熱門行政區標題切換
var el_title_area = document.querySelector('.wrapper .content-title-area');
var el_box = document.querySelector('.wrapper .box-content'); //高雄市行政區資料box 
var el_select = document.querySelector('.wrapper .header select'); //點擊chang

var el_pages = document.querySelector('.wrapper .pages'); //頁碼父元素

var str = ''; //box字串
var j = 0; //奇數判斷

//初始的時候
el_box.innerHTML = '';
el_pages.innerHTML = '';
el_title_area.innerHTML = '<p>請選擇行政區域<p>';
//監聽
el_select.addEventListener('change', event_chang_area, false);
el_hotarea.addEventListener('click', event_click_area, false);

function event_chang_area(e) {
    var zone = e.target.value;
    click_area(zone);
}

function event_click_area(e) {
    if (e.target.nodeName !== 'A') { return; } //沒點到a連結無動作 
    if (e.target.nodeName == 'A') {
        if (e.target.innerText) {
            e.preventDefault();
            var zone = e.target.innerText;
        }
    }
    click_area(zone);
}

function click_area(zone) {
    //陣列儲存資料
    var array = [];

    for (var i = 0; i < recordLen; i++) {
        if (zone == records[i].Zone) {
            array.push(records[i]);
            //在監聽裡面生成頁碼
            var str_pages = '';

            if (Math.floor(array.length / 8) + 1 == 2 && array.length > 8) {
                for (var j = 1; j <= Math.floor(array.length / 8) + 1; j++) {
                    var content_pages = '<a href="#">' + j + '</a>';
                    str_pages += content_pages;
                    el_pages.innerHTML = str_pages;
                }
            } else {
                el_pages.innerHTML = '';
            }

            //讓筆數從0~8開始
            page_Min = 0;
            page_Max = 8;
            el_title_area.innerHTML = '<p>' + records[i].Zone + '<p>'; //區域標題切換
        } else if (zone == '鹽埕區') { //json格式沒有鹽埕區
            el_title_area.innerHTML = '<p>' + zone + '<p>';
            el_box.innerHTML = '';
        }
    }
    array_area(array, page_Min, page_Max);
    el_pages.addEventListener('click', click_page_area, false); //監聽頁碼切換筆數
    function click_page_area(e) {
        if (e.target.innerText) {
            page_Min = 0;
            page_Max = 8;
            page_Max *= e.target.innerText;
            page_Min = page_Max - 8;
            array_area(array, page_Min, page_Max);
        }
        array_area(array, page_Min, page_Max);
    }
}

function array_area(array, page_Min, page_Max) {
    var str = ''; //字串
    var j = 0; //奇數判斷
    for (var k = page_Min; k < page_Max; k++) { //按區域的迴圈渲染
        j++;
        if (j % 2 == 1) {
            var content = '<div class="box box1"><div class="box-img"><img src="' + array[k].Picture1 + '" alt=""><p class="box-img-title">' + array[k].Name + '</p><p class="box-img-title-area">' + array[k].Zone + '</p></div><ul><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="" class="icons_clock">' + array[k].Opentime + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="" class="icons_pin">' + array[k].Add + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="" class="icons_phone">' + array[k].Tel + '</li><li class="title-free"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="" class="icons_tag">' + array[k].Ticketinfo + '</li></ul></div>';

            if (array[k].Ticketinfo !== '免費參觀') { //判斷沒有免費參觀
                var content = '<div class="box box1"><div class="box-img"><img src="' + array[k].Picture1 + '" alt=""><p class="box-img-title">' + array[k].Name + '</p><p class="box-img-title-area">' + array[k].Zone + '</p></div><ul><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="" class="icons_clock">' + array[k].Opentime + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="" class="icons_pin">' + array[k].Add + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="" class="icons_phone">' + array[k].Tel + '</li></ul></div>';
            }
            str += content;
        } else {
            var content = '<div class="box"><div class="box-img"><img src="' + array[k].Picture1 + '" alt=""><p class="box-img-title">' + array[k].Name + '</p><p class="box-img-title-area">' + array[k].Zone + '</p></div><ul><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="" class="icons_clock">' + array[k].Opentime + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="" class="icons_pin">' + array[k].Add + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="" class="icons_phone">' + array[k].Tel + '</li><li class="title-free"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="" class="icons_tag">' + array[k].Ticketinfo + '</li></ul></div>';

            if (array[k].Ticketinfo !== '免費參觀') { //判斷沒有免費參觀
                var content = '<div class="box"><div class="box-img"><img src="' + array[k].Picture1 + '" alt=""><p class="box-img-title">' + array[k].Name + '</p><p class="box-img-title-area">' + array[k].Zone + '</p></div><ul><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="" class="icons_clock">' + array[k].Opentime + '</li><li><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="" class="icons_pin">' + array[k].Add + '</li></ul></div>';
            }
            str += content;
        }
        el_box.innerHTML = str;
    }
}