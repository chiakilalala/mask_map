    /*var myMap = L.map('map', {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                center: [22.595551, 120.306945],

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                zoom: 15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
    // 跟第一行是同樣效果的是建立流程不同
    window.onload = function() {

        loader();
        getTime();
        //下拉選單
        let citySearch = document.querySelector('.city-search');
        let distSearch = document.querySelector('.dist-search');



        /*this 推拉button  */
        var toggle_btn = document.querySelector('.js_toggle');

        var panel = document.querySelector('.m-panel');
        toggle_btn.onclick = function(e) {
            // e.preventDefault();
            panel.classList.toggle("menu-off");

        };



        //初始的時候
        // dist_search.innerHTML = '請選擇行政地址';


        var myMap = L.map('map').setView([22.595551, 120.306945], 13);
        // https: //{s}.tile.opentopomap.org/{z}/{x}/{y}.png
        var OpenStreetMap_BlackAndWhite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
            subdomains: 'abcd',
            maxZoom: 13, //最大縮放zoom等級
            errorTilrUrl: '',
            attribution: 'Map data: © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
        OpenStreetMap_BlackAndWhite.addTo(myMap);

        // L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        //     maxZoom: 15,
        //     zoomOut: 12,
        //     attribution: 'Map data: © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        // }).addTo(myMap)
        var yellowIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
                // shadowSize: [41, 41]
        });

        var blockIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
                // shadowSize: [41, 41]
        });


        var markers = new L.markerClusterGroup().addTo(myMap);

        //  投入真正的資料
        var xhr = new XMLHttpRequest();
        //JSON.parse 
        // http: //localhost:5500/points.json

        xhr.open("GET", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", true);
        xhr.send();
        xhr.addEventListener('load', function() {
            loaderDone();
            var data = JSON.parse(this.responseText).features;
            var list = document.querySelector('.e-search-body-scroll');
            var str = '';
            getList('大安區', '臺北市');
            selectCountry();

            //篩選重複的市----
            //下拉選單-------
            function selectCountry() {
                let country;
                let CountryList = [];
                for (let i = 0; i < data.length; i++) {
                    let selectCounty = data[i].properties.county;
                    CountryList.push(selectCounty);
                }
                //搧出重複的
                country = CountryList.filter(function(value, index, arr) {
                    return arr.indexOf(value) === index;
                });

                updateSelect(country);
            }
            // console.log(country);

            function updateSelect(country) {
                let str = `<option value="">-- 請選擇縣市 --</option>`;
                for (let i = 0; i < country.length; i++) {
                    str += `<option value="${country[i]}">${country[i]}</option>`
                }
                citySearch.innerHTML = str;
            }

            //篩選重複的區===============================
            function getValue(e) {
                selectZone(e);
            }

            function selectZone(e) {

                let val = e.target.value;
                // console.log(val);
                let str = `<option value="">-- 請選擇鄉鎮區 --</option>`;
                let ZoneList = [];
                let Newzone = '';
                for (let i = 0; i < data.length; i++) {
                    // console.log(data[i].properties.county);
                    let forCounty = data[i].properties.county;
                    // console.log(val, forCounty);
                    if (val == forCounty) {
                        // ZoneList.push({ district: data[i].properties.town });
                        ZoneList.push(data[i].properties.town);

                    }
                    // console.log(ZoneList);
                }

                Newzone = new Set(ZoneList);
                // console.log(Newzone);
                Newzone = Array.from(Newzone);
                // console.log(Newzone);

                // Newzone = ZoneList.filter(function(value, index, arr) {
                //     return arr.indexOf(value) !== index;
                // });
                // console.log(Newzone);
                for (let i = 0; i < Newzone.length; i++) {
                    str += `<option value="${Newzone[i]}">${Newzone[i]}</option>`
                }

                distSearch.innerHTML = str;
                distSearch.addEventListener('change', getlocationView);

            }
            //確認縣市是否有空值
            function checkForm() {
                if (citySearch.value == '') {
                    alert('請先選擇縣市');
                }
            };
            //篩選重複的區>setview=======================
            function getlocationView(e) {
                let zone = e.target.value;
                let latlng = [];
                let country = '';

                // let latlng = [];

                for (let i = 0; i < data.length; i++) {
                    let forTwon = data[i].properties.town;
                    let forcountry = data[i].properties.county;
                    let lat = data[i].geometry.coordinates[0]; //緯度
                    let lng = data[i].geometry.coordinates[1]; //經度

                    if (forTwon == zone && forcountry == citySearch.value) {
                        latlng = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
                        // console.log(latlng);
                        country = data[i].properties.county;
                        // console.log(country);
                    }
                }
                myMap.setView(latlng, 15);
                getList(zone, country);
            }


            ///藥局列表

            function getList(zone, country) {
                let str = '';
                for (var i = 0; i < data.length; i++) {
                    let popAdult;
                    let popChild;
                    let m_adult = data[i].properties.mask_adult;
                    let m_child = data[i].properties.mask_child;
                    if (m_adult >= 50) {
                        popAdult = 'bg--nice';
                    } else if (m_adult < 50 && m_adult !== 0) {
                        popAdult = 'bg--danger';
                    } else {
                        popAdult = 'bg--none';
                    }
                    if (m_child >= 50) {
                        popChild = 'bg--nice';
                    } else if (m_child < 50 && m_child !== 0) {
                        popChild = 'bg--danger';

                    } else {
                        popChild = 'bg--none';
                    }

                    if (data[i].properties.address.indexOf(country && zone) != -1) {
                        str += `<li class="pharmacy-wrap eumorphism">
                                    <h3 class="pharmacy-name">${data[i].properties.name} </h3>               
                                    <p><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com.tw/maps/place/${data[i].properties.name}" class="address" target="_blank">${data[i].properties.address}</a></p> 
                                    <p><i class="fa fa-phone"></i> ${data[i].properties.phone}</p>
                                     <div class= "e-mask-wrap">
                                    <div class= "mask adult-mask  ${popAdult}"> 
                                    <img src= "img/boy.svg" alt ="成人口罩"class= "e-img mask-img">
                                    <p>:${data[i].properties.mask_adult } </p>
                                    </div>
                                    <div class= "mask child-mask ${popChild}" >
                                    <img src= "img/baby.svg" alt = "兒童口罩"class= "e-img mask-img">
                                        <p>：${data[i].properties.mask_child }</p> 
                                    </div>
                                </div>
                                </li>`;
                    }
                }
                list.innerHTML = str;
            }


            //篩選重複的市----end
            //判斷popup裡的btn顏色、marker顏色
            for (var i = 0; i < data.length; i++) {
                var popAdult;
                var popChild;
                var mask_adult = data[i].properties.mask_adult;
                var mask_child = data[i].properties.mask_child;
                var mask;

                if (mask_adult + mask_child >= 100) {
                    mask = yellowIcon;
                } else {
                    mask = blockIcon;
                }
                if (mask_adult >= 50) {
                    popAdult = 'bg--nice';
                } else if (mask_adult < 50 && mask_adult != 0) {
                    popAdult = 'bg--danger';
                } else {
                    popAdult = 'bg--none';
                }
                if (mask_child >= 50) {
                    popChild = 'bg--nice';
                } else if (mask_child < 50 && mask_child != 0) {
                    popChild = 'bg--danger';
                } else {
                    popChild = 'bg--none';
                }
                markers.addLayer(L.marker([data[i].geometry.coordinates[1],
                        data[i].geometry.coordinates[0]
                    ], { icon: mask })
                    .bindPopup(` <div class="pop"><h3 class="pharmacy-name">${data[i].properties.name} </h3>
                     <p class="detail"><i class="fas fa-map-marker-alt"></i>
                     <a href="https://www.google.com.tw/maps/place/${data[i].properties.name}" class="address" target="_blank">${data[i].properties.address}</a></p>
                         <p class="detail"><i class="fa fa-phone"></i>${data[i].properties.phone}</p>
                     <p class="detail time">更新時間：${data[i].properties.updated == "" ? '無資料' : data[i].properties.updated.slice(5) }-- 以實際營業時間</p>
                         <div class="store_statue">
                    <div class="container ${popAdult}">
                    <p> 成人口罩數量</p>
                      <p>${mask_adult} 片</p></div>
                    <div class="container ${popChild}">
                     <p> 兒童口罩數量</p>    
                        <p>${mask_child}片</p></div>
                        </div></div>`));
                // --以實際發放為準


            };
            /*  下拉選單*/


            //事件重新載入


            // 事件更新

            // console.log(Zone);

            // console.log(Country);

            //監聽
            citySearch.addEventListener('change', selectZone);
            distSearch.addEventListener("click", checkForm);

            myMap.addLayer(markers);


        });
        //gettime===================================
        /*顯示時間*/

        function getTime() {
            //宣告
            const dt = new Date();
            //時間顯示 
            let nowYear = dt.getFullYear(); //年份
            let nowMonth = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1).toString() : '0' + (dt.getMonth() + 1); //月'份
            let nowDay = (dt.getDate()) > 9 ? (dt.getDate()).toString() : '0' + (dt.getDate()); //日期
            let weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
            let idBuyDay;
            switch (weekdays[dt.getDay()]) {
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
                    idBuyDay = '不限';
            }
            let curentTime = nowYear + '-' + nowMonth + '-' + nowDay;
            let idDay = `身分證尾數<mark>${idBuyDay}購買日</mark>`;
            let dateTxt = `<p class="date">${curentTime}</p>
                             <h2>${weekdays[dt.getDay()]}</h2> 
                             <p class="e-verification"> ${idDay} </p>  `;
            let date = document.querySelector('.date'); //顯示時間的地方
            date.innerHTML = dateTxt;


        }

        /*loader*/
        function loader() {
            document.querySelector("body").style.overflow = "hidden";
            document.querySelector("body").style.visibility = "hidden";
            document.querySelector(".m-panel").style.zIndex = 0;
            document.querySelector("#js--loader").style.visibility = "visible";
        }

        function loaderDone() {
            document.querySelector("#js--loader").style.display = "none";
            document.querySelector("body").style.visibility = "visible";
            document.querySelector(".m-panel").style.zIndex = 999;
            document.querySelector("body").style.overflow = "auto";
        }








    };