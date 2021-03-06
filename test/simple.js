var map;
var maskData;
var zoneData;
var popup;
var countryForm = document.getElementById('countryForm');
var zoneForm = document.getElementById('zoneForm');
var resultList = document.querySelector('.resultList');
var maskFilter = document.querySelectorAll('.maskFilter')
    //取得sidebar
var sidebar = L.control.sidebar('sidebar', {
    position: 'left'
});
//function=================================
loader();
//set default location
map = L.map('map').setView([23.5, 120.5], 8);
//maxZoom: 16 as the maximum zoom
map.locate({ maxZoom: 16 });
//show alert if locate error
map.on('locationerror', onLocationError);
//find your location
map.on('locationfound', onLocationFound);
countryForm.addEventListener('change', zoneSelect);
zoneForm.addEventListener('click', checkFormValue);
resultList.addEventListener('scroll', slideUp);

//執行sidebar
map.addControl(sidebar);
// Show sidebar
if (window.screen.width > 768) {
    sidebar.show();
}
addBar();
getTime()
getmaskJSON();
getzoneJSON();
maskFilterEvent();
// colorNoteInit();
//建立地圖==================================
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/">OSM</a> | Made by Kevin Hsu',
    maxZoom: 19,
}).addTo(map);
//取JSON====================================
//取地區JSON
function getzoneJSON() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/kevinshu1995/maskmap/gh-pages/latlng.json');
    xhr.send(null);
    xhr.onload = function() {
        if (xhr.status == 200 && xhr.readyState == 4) {
            zoneData = JSON.parse(xhr.responseText);
        } else {
            alert('無法讀取資料，請重新整理。');
        }
    }
}
//取口罩JSON
function getmaskJSON() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR3XtDf10Tocq8nHU3kLdEtLvAb_yBIPum9i_t2m_wsHMV41ZdufKpWjDu4');
    xhr.send(null);
    xhr.onload = function() {
        if (xhr.status == 200 && xhr.readyState == 4) {
            loaderDone();
            maskData = JSON.parse(xhr.responseText).features;
            countrySelect();
            getdata();
            getList('松山區', '臺北市');
        } else {
            alert('無法讀取資料，請重新整理。');
        }
    }
}
//篩選重複的市==============================
function countrySelect() {
    let country;
    let countryAry = [];
    for (let i = 0; i < zoneData.length; i++) {
        let countryStr = zoneData[i].city
        countryAry.push(countryStr);
    }
    // let zoneStr = maskData[i].properties.address.substring(0, 6);
    country = countryAry.filter(function(value, index, arr) {
        return arr.indexOf(value) === index;
    });
    // console.log(country);
    updateSelect(country);
}

function updateSelect(country) {
    let str = `<option value="">-- 請選擇縣市 --</option>`;
    for (let i = 0; i < country.length; i++) {
        str += `<option value="${country[i]}">${country[i]}</option>`
    }
    countryForm.innerHTML = str;
}
//篩選重複的區===============================
function getValue(e) {
    zoneSelect(e);
}

function zoneSelect(e) {
    let val = e.target.value;
    let str = `<option value="">-- 請選擇鄉鎮區 --</option>`;
    let zoneAry = [];
    for (let i = 0; i < zoneData.length; i++) {
        if (val == zoneData[i].city) {
            zoneAry.push({ district: zoneData[i].district });

        }
    }
    for (let i = 0; i < zoneAry.length; i++) {
        str += `<option value="${zoneAry[i].district}">${zoneAry[i].district}</option>`
    }
    zoneForm.innerHTML = str;
    zoneForm.addEventListener('change', getlocationView);
}
//確認縣市是否有空值
function checkFormValue() {
    if (countryForm.value == '') {
        alert('請先選擇縣市')
    }
};
//篩選重複的區>setview=======================
function getlocationView(e) {
    let zone = e.target.value;
    let country = '';
    let latlng = [];
    for (let i = 0; i < zoneData.length; i++) {
        if (zoneData[i].district == zone && zoneData[i].city == countryForm.value) {
            latlng = [zoneData[i].lat, zoneData[i].lng];
            country = zoneData[i].city;
        }
    }
    map.setView(latlng, 15);
    getList(zone, country);
}
//篩選口罩數量 | 監聽 =======================
function maskFilterEvent() {
    for (let i = 0; i < maskFilter.length; i++) {
        maskFilter[i].addEventListener('click', maskQueue)
    }
}
//篩選口罩數量 | 重新排順序
function maskQueue(e) {
    let btnVal = String(e.target.value);
    let countryVal = countryForm.value;
    let zoneVal = zoneForm.value;
    let maskFilterList = [];
    for (let i = 0; i < maskData.length; i++) {
        if (maskData[i].properties.county == countryVal && maskData[i].properties.town == zoneVal) {
            maskFilterList.push({
                mask_adult: maskData[i].properties.mask_adult,
                mask_child: maskData[i].properties.mask_child,
                mask_all: maskData[i].properties.mask_child + maskData[i].properties.mask_adult,
                name: maskData[i].properties.name,
                phone: maskData[i].properties.phone,
                address: maskData[i].properties.address
            });
        }
    }
    // console.log(maskFilterList);
    // console.log(btnVal == 'mask__child');
    if (btnVal == 'mask__child') {
        maskFilterList = maskFilterList.sort(function(a, b) {
            return a.mask_child > b.mask_child ? -1 : 1;
        });
        console.log('1')
        getListFilter(maskFilterList)
    } else {
        maskFilterList = maskFilterList.sort(function(a, b) {
            return a.mask_adult > b.mask_adult ? -1 : 1;
        });
        console.log('2')
        getListFilter(maskFilterList)
    }
}
//藥局列表
function getList(zone, country) {
    let str = `<li class="resultList__defaultList">-- 以下為${country}${zone}內的藥局 --</li>`;
    for (let i = 0; i < maskData.length; i++) {
        let maskDataVal = maskData[i].properties;
        let popupBgCoAdult;
        let popupBgCoChild;
        let m_adult = maskDataVal.mask_adult;
        let m_child = maskDataVal.mask_child;
        if (m_adult >= 50) {
            popupBgCoAdult = "l-bgco--nice";
        } else if (m_adult < 50 && m_adult != 0) {
            popupBgCoAdult = "l-bgco--danger";
        } else {
            popupBgCoAdult = "l-bgco--none"
        }
        if (m_child >= 50) {
            popupBgCoChild = "l-bgco--nice";
        } else if (m_child < 50 && m_child != 0) {
            popupBgCoChild = "l-bgco--danger";
        } else {
            popupBgCoChild = "l-bgco--none"
        }
        if (maskData[i].properties.address.indexOf(country && zone) != -1) {
            str += `
    <li class="resultList__wrap">
      <div class="resultList__wrap__tilte">
        <h2 class="locatPlace">${maskDataVal.name}</h2>
        <a href="https://www.google.com.tw/maps/place/${maskDataVal.name}" class="address" target="_blank"><i
          class="fas fa-directions"></i></a>
      </div>
      <h3><i class="fas fa-map-marker-alt"></i> 地址 : ${maskDataVal.address}</h3>
      <h3><i class="fas fa-phone-alt"></i> 電話 : <a href="tel:${maskDataVal.phone}">${maskDataVal.phone}</a></h3>
      <ul class="list__maskwrap">
        <li class="${popupBgCoAdult}">成人口罩 ${maskDataVal.mask_adult}個</li>
        <li class="${popupBgCoChild}">兒童口罩 ${maskDataVal.mask_child}個</li>
      </ul>
    </li>
    `
        }
    }
    resultList.innerHTML = str;
    var locatPlace = document.querySelectorAll('.locatPlace');
    var locatPlaceList = document.querySelectorAll('.resultList__wrap');
    locatPlaceAddEvent(locatPlace, locatPlaceList);
}
//過濾大人、小孩口罩
function getListFilter(maskFilterList) {
    if (countryForm.value == "" || zoneForm.value == "") { return }
    let str = `<li class="resultList__defaultList">-- 以下為${countryForm.value}${zoneForm.value}內的藥局 --</li>`;
    for (let i = 0; i < maskFilterList.length; i++) {
        let maskDataVal = maskFilterList[i];
        let popupBgCoAdult;
        let popupBgCoChild;
        let m_adult = maskDataVal.mask_adult;
        let m_child = maskDataVal.mask_child;
        if (m_adult >= 50) {
            popupBgCoAdult = "l-bgco--nice";
        } else if (m_adult < 50 && m_adult != 0) {
            popupBgCoAdult = "l-bgco--danger";
        } else {
            popupBgCoAdult = "l-bgco--none"
        }
        if (m_child >= 50) {
            popupBgCoChild = "l-bgco--nice";
        } else if (m_child < 50 && m_child != 0) {
            popupBgCoChild = "l-bgco--danger";
        } else {
            popupBgCoChild = "l-bgco--none"
        }
        str += `
    <li class="resultList__wrap">
      <div class="resultList__wrap__tilte">
        <h2 class="locatPlace">${maskDataVal.name}</h2>
        <a href="https://www.google.com.tw/maps/place/${maskDataVal.name}" class="address" target="_blank"><i
          class="fas fa-directions"></i></a>
      </div>
      <h3><i class="fas fa-map-marker-alt"></i> 地址 : ${maskDataVal.address}</h3>
      <h3><i class="fas fa-phone-alt"></i> 電話 : <a href="tel:${maskDataVal.phone}">${maskDataVal.phone}</a></h3>
      <ul class="list__maskwrap">
        <li class="${popupBgCoAdult}">成人口罩 ${maskDataVal.mask_adult}個</li>
        <li class="${popupBgCoChild}">兒童口罩 ${maskDataVal.mask_child}個</li>
      </ul>
    </li>
    `
    }
    resultList.innerHTML = str;
    var locatPlace = document.querySelectorAll('.locatPlace');
    var locatPlaceList = document.querySelectorAll('.resultList__wrap');
    locatPlaceAddEvent(locatPlace, locatPlaceList);
}
//default locate============================
function onLocationFound(e) {
    let radius = e.accuracy;
    let currentLocat = new L.MarkerClusterGroup().addTo(map);
    currentLocat.addLayer(L.marker(e.latlng).addTo(map)
        .bindPopup("您目前的位置").openPopup());
    L.circle(e.latlng, radius).addTo(map);
    map.setView(e.latlng, 14);
}
//alert location error======================
function onLocationError(e) {
    e.message = "無法使用GPS抓取您的位置，請開啟GPS功能後，重新整理頁面。"
    alert(e.message);
}
//取得data 並 set markers===================
function getdata() {
    let dataFilter = [];
    // let dataFilter = [{
    //   //geometry 經緯度
    //   geometry: '',
    //   //地點
    //   address: '',
    //   //藥局名稱
    //   name: '',
    //   //藥局電話
    //   tel: '',
    //   //口罩 大人
    //   mask_adult: '',
    //   //口罩 小孩
    //   mask_child: '',
    //   //更新時間
    //   updated: '',
    //   //開放時間
    //   available: ''
    // }]
    for (let i = 0; i < maskData.length; i++) {
        //
        let zone = maskData[i].properties.address.substring(0, 3);
        // if (countryUser === zone) {
        dataFilter.push({
                geometry: maskData[i].geometry.coordinates.reverse(),
                address: maskData[i].properties.address,
                name: maskData[i].properties.name,
                tel: maskData[i].properties.phone,
                mask_adult: maskData[i].properties.mask_adult,
                mask_child: maskData[i].properties.mask_child,
                updated: maskData[i].properties.updated,
                available: maskData[i].properties.available
            })
            // }
    }
    setMarker(dataFilter)
}
//set markers
var markers = new L.MarkerClusterGroup().addTo(map);

function setMarker(dataFilter) {
    //marker's color set
    let niceIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    let dangerIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    let noneIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    for (let i = 0; i < dataFilter.length; i++) {
        let popupBgCoAdult;
        let popupBgCoChild;
        let markerColor;
        let m_adult = dataFilter[i].mask_adult;
        let m_child = dataFilter[i].mask_child;
        //判斷popup裡的btn顏色、marker顏色
        if (m_adult + m_child >= 100) {
            markerColor = niceIcon;
        } else if (m_adult + m_child < 100 && m_adult + m_child != 0) {
            markerColor = dangerIcon;
        } else {
            markerColor = noneIcon;
        }
        if (m_adult >= 50) {
            popupBgCoAdult = "l-bgco--nice";
        } else if (m_adult < 50 && m_adult != 0) {
            popupBgCoAdult = "l-bgco--danger";
        } else {
            popupBgCoAdult = "l-bgco--none"
        }
        if (m_child >= 50) {
            popupBgCoChild = "l-bgco--nice";
        } else if (m_child < 50 && m_adult != 0) {
            popupBgCoChild = "l-bgco--danger";
        } else {
            popupBgCoChild = "l-bgco--none"
        }
        markers.addLayer(L.marker(dataFilter[i].geometry, { icon: markerColor }) //.addTo(map)
            //彈出視窗
            .bindPopup(`
      <div class="l-popupWrap">
        <h2 class="l-popup__name">${dataFilter[i].name}</h2>
        <ul class="l-popup__detail">
          <li><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com.tw/maps/place/${dataFilter[i].address}" target="_blank">${dataFilter[i].address}</a></li>
          <li><i class="fas fa-phone-alt"></i> <a href="tel:${dataFilter[i].tel}">${dataFilter[i].tel}</a></li>
          <li>更新時間：${dataFilter[i].updated == "" ? '無資料' : dataFilter[i].updated} - 實際以藥局發放為準</li>
        </ul>
        <div class="l-popup__inputWrap">
          <input type="button" value="成人口罩 ${m_adult} 個" class="${popupBgCoAdult}">
            <input type="button" value="兒童口罩 ${m_child} 個" class="${popupBgCoChild}">
      </div>
    </div>
          `));
    }
}
//add sidebarsettingBtn=====================
function addBar() {
    let sideBarBtn = document.querySelector('.leaflet-control-zoom');
    sideBarBtn.innerHTML = `
  <a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
          <a class="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">−</a>
          <a class="showSideBtn  showSideBtn--out" href="#" role="button"><i class="fas fa-bars"></i></a>
          `
    let showSideBtnOut = document.querySelector('.showSideBtn--out');
    let showSideBtnIn = document.querySelector('.showSideBtn--in');
    showSideBtnOut.addEventListener('click', toggleSideBar);
    showSideBtnIn.addEventListener('click', toggleSideBar);
}

function toggleSideBar() {
    sidebar.toggle();
    let showSideBtnOut = document.querySelector('.showSideBtn--out');
    showSideBtnOut.classList.toggle("sideBtn--ani");
}
//click list to show on map=================
function locatPlaceAddEvent(locatPlace, locatPlaceList) {
    for (let i = 0; i < locatPlace.length; i++) {
        locatPlaceList[i].addEventListener('click', locatPlaceFun);
    };
}

function locatPlaceFun(e) {
    let name = e.path[1].firstElementChild.innerText;
    let locat;
    for (let i = 0; i < maskData.length; i++) {
        if (maskData[i].properties.name == name) {
            locat = [maskData[i].geometry.coordinates[0], maskData[i].geometry.coordinates[1]];
        }
    }
    //  sidebar._contentContainer.offsetWidth /2
    // console.log(locat);
    if (window.innerWidth < 768) {
        sidebar.toggle();
    }
    //fix view center position
    if (sidebar.isVisible()) {
        let corner2 = L.latLng(locat[0], locat[1] - 0.0009);
        let bounds = L.latLngBounds(locat, corner2);
        map.fitBounds([locat, [corner2]])
    } else {
        map.setView(locat, 18);
    }
}
//sidebar slideUp
function slideUp() {
    let selectwrap = document.querySelector('.selectwrap');
    let searchBtn = document.querySelector('.sidebar__title');
    let searchNote = document.querySelector('.searchNote');
    selectwrap.style.display = "none";
    searchBtn.style.cursor = "pointer";
    searchNote.style.display = "inline";
    searchBtn.addEventListener('click', showSearchSection)
}

function showSearchSection() {
    let searchNote = document.querySelector('.searchNote');
    let selectwrap = document.querySelector('.selectwrap');
    selectwrap.style.display = "block";
    searchNote.style.display = "none";
}
//gettime===================================
function getTime() {
    let time = new Date();
    let tYear = time.getFullYear().toString();
    let tMonth = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1);
    let tDate = (time.getDate()) > 9 ? (time.getDate()).toString() : '0' + (time.getDate());
    let weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
    let idBuyDay;
    switch (weekdays[time.getDay()]) {
        case '星期一':
        case '星期三':
        case '星期五':
            idBuyDay = '奇數';
            break;
        case '星期二':
        case '星期四':
        case '星期六':
            idBuyDay = '偶數';
            break;
        case '星期日':
            idBuyDay = '不限'
    }
    let curentTime = tYear + ' / ' + tMonth + ' / ' + tDate + ' / ' + weekdays[time.getDay()];
    let idDay = `身分證尾數<mark>${idBuyDay}購買日</mark>`
    let str = ` <h3>${curentTime}</h3>
              <h2 class="sidebar__ID">${idDay}</h2>`
    let sideBarTime = document.querySelector('.sidebar__note__time');
    sideBarTime.innerHTML = str;
}
//loader
function loader() {
    document.querySelector("body").style.visibility = "hidden";
    document.querySelector("body").style.overflow = "hidden";
    document.querySelector("#js--loader").style.visibility = "visible";
}

function loaderDone() {
    document.querySelector("#js--loader").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
    document.querySelector("body").style.overflow = "auto";
}
//colorNote===================================================
let outter = document.querySelector('.colorNote');
outter.addEventListener('click', colorNotedisplay);
outter.click();

function colorNotedisplay(e) {
    let wrap = document.querySelector('.colorNote__wrap');
    let child = e.target.offsetParent.lastElementChild.firstElementChild;
    let str = `
      <li class="colorNote__title">
        <img src="images/marker--nice.png" alt="marker">
        <h2 class="colorNote__nice">多於50個</h2>
      </li>
      <li class="colorNote__title">
        <img src="images/marker--danger.png" alt="">
        <h2 class="colorNote__danger">少於50個</h2>
      </li>
      <li class="colorNote__title">
        <img src="images/marker--none.png" alt="">
        <h2 class="colorNote__none">沒有存貨</h2>
      </li>
  `
    let borderEl = document.querySelector('.colorNote__title')
    let arrow = document.querySelector('.fa-angle-up')
    if (wrap.innerHTML == "") {
        wrap.innerHTML = str
        borderEl.style.borderBottomRightRadius = "0px";
        borderEl.style.borderBottomLeftRadius = "0px";
        arrow.style.transform = "rotate(0deg)";
        arrow.style.lineHeight = "1em";
    } else {
        wrap.innerHTML = "";
        borderEl.style.borderBottomRightRadius = "5px";
        borderEl.style.borderBottomLeftRadius = "5px";
        arrow.style.transform = "rotate(180deg)";
        arrow.style.lineHeight = "1.1em";

    }
}