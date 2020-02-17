    /*var myMap = L.map('map', {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                center: [22.595551, 120.306945],

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                zoom: 15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
    // 跟第一行是同樣效果的是建立流程不同
    window.onload = function() {


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
            var data = JSON.parse(this.responseText).features;
            var list = document.querySelector('.e-search-body-scroll');
            var str = '';


            selectCountry();
            getList('大安區', '臺北市');




            //篩選重複的市----

            /*  下拉選單*/
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
                // console.log(country);
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
                let str = `<option value="">-- 請選擇鄉鎮區 --</option>`;
                let ZoneList = [];
                let Newzone = '';
                for (let i = 0; i < data.length; i++) {
                    let forCounty = data[i].properties.county;
                    if (val == forCounty) {
                        ZoneList.push({ district: data[i].properties.town });

                    }
                    // console.log(ZoneList);
                }

                Newzone = ZoneList.filter(function(value, index, arr) {
                    return arr.indexOf(value) !== index;
                });
                console.log(Newzone);
                for (let i = 0; i < ZoneList.length; i++) {
                    str += `<option value="${ZoneList[i].district}">${ZoneList[i].district}</option>`
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
                let country = '';
                let latlng = [];
                // let latlng = [];

                for (let i = 0; i < data.length; i++) {
                    let forTwon = data[i].properties.town;
                    let forcountry = data[i].properties.county;
                    let lat = data[i].geometry.coordinates[0]; //緯度
                    let lng = data[i].geometry.coordinates[1]; //經度
                    let latlng = [];
                    if (forTwon == zone && forcountry == citySearch.value) {

                        latlng = [lng, lat];
                        console.log(latlng);
                        country = data[i].properties.county;
                        console.log(country);
                    }
                }
                myMap.setView(latlng, 15);
                getList(zone, country);
            }


            ///藥局列表

            function getList(zone, country) {
                let str = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].properties.address.indexOf(country && zone) != -1) {
                        str += `<li class="pharmacy-wrap eumorphism">
                                    <h3 class="pharmacy-name">${data[i].properties.name} </h3>               
                                    <p><i class="fas fa-map-marker-alt"></i> ${data[i].properties.address}</p> 
                                    <p><i class="fa fa-phone"></i> ${data[i].properties.phone}</p>
                                     <div class= "e-mask-wrap">
                                    <div class= "mask adult-mask  no-mask"> 
                                    <img src= "img/boy.svg" alt ="成人口罩"class= "e-img mask-img">
                                    <p>:${data[i].properties.mask_adult } </p>
                                    </div>
                                    <div class= "mask child-mask" >
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

            for (var i = 0; i < data.length; i++) {


                var mask;
                if (data[i].properties.mask_adult == 0 || data[i].properties.mask_child == 0) {
                    mask = blockIcon;
                } else {
                    mask = yellowIcon;
                }
                markers.addLayer(L.marker([data[i].geometry.coordinates[1],
                        data[i].geometry.coordinates[0]
                    ], { icon: mask })
                    .bindPopup(` <div class="pop"><h3 class="pharmacy-name">${data[i].properties.name} </h3>
                     <p class="detail"><i class="fas fa-map-marker-alt"></i>${data[i].properties.address}</p>
                         <p class="detail"><i class="fa fa-phone"></i>${data[i].properties.phone}</p>
                     <div class="store_statue">
                    <div class="container">
                    <p> 成人口罩數量</p>
                      <p>${data[i].properties.mask_adult} 片</p></div>
                    <div class="container">
                     <p> 兒童口罩數量</p>    
                        <p>${data[i].properties.mask_child}片</p></div>
                        </div></div>`));

                /*  下拉選單*/



            };


            //事件重新載入
            /*function creatLoad() {
                var Newstr = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].properties.county == '台北市' && data[i].properties.town == '大安區') {
                        Newstr += `<li class="pharmacy-wrap eumorphism">
                                    <h3 class="pharmacy-name">${data[i].properties.name} </h3>               
                                    <p><i class="fas fa-map-marker-alt"></i> ${data[i].properties.address}</p> 
                                    <p><i class="fa fa-phone"></i> ${data[i].properties.phone}</p>
                                     <div class= "e-mask-wrap">
                                    <div class= "mask adult-mask  no-mask"> 
                                    <img src= "img/boy.svg" alt ="成人口罩"class= "e-img mask-img">
                                    <p>:${data[i].properties.mask_adult } </p>
                                    </div>
                                    <div class= "mask child-mask" >
                                    <img src= "img/baby.svg" alt = "兒童口罩"class= "e-img mask-img">
                                        <p>：${data[i].properties.mask_child }</p> 
                                    </div>
                                </div>
                                </li>`;


                    }
                    list.innerHTML = Newstr;
                }

            }

            creatLoad();*/

            // 事件更新
            // function updatelist(e) {
            //     let select = e.target.value;
            //     console.log(e.target.value);
            //     let boxstr = '';
            //     for (var y = 0; y < data.length; y++) {
            //         if (select == data[y].properties.county) {

            //             boxstr +=
            //                 `<li class="pharmacy-wrap eumorphism">
            //                         <h3 class="pharmacy-name">${data[y].properties.name} </h3>               

            //                     </li>`;
            //         }
            //         list.innerHTML = boxstr;

            //     }

            // }
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
                    idBuyDay = '不限'
            }
            let curentTime = nowYear + ' - ' + nowMonth + '- ' + nowDay;
            let idDay = `身分證尾數<mark>${idBuyDay}購買日</mark>`;
            let dateTxt = `<p class="date">${curentTime}</p>
                             <h2>${weekdays[dt.getDay()]}</h2> 
                             <p class="e-verification"> ${idDay} </p>  `;
            let date = document.querySelector('.date'); //顯示時間的地方
            date.innerHTML = dateTxt;
        }





        // myPositionMarker.on("click", function() {
        //     var pos = myMap.latLngToLayerPoint(myPositionMarker.getLatLng());
        //     pos.y -= 25;
        //     var fx = new L.PosAnimation();

        //     fx.once('end', function() {
        //         pos.y += 25;
        //         fx.run(myPositionMarker._icon, pos, 0.8);
        //     });

        //     fx.run(myPositionMarker._icon, pos, 0.3);

        // });
        // 設定 icon


        // L.marker([22.595823, 120.307460], { icon: greenIcon }).addTo(myMap)
        //     .bindPopup('<h1>康是美藥局</h1><p>成人口罩：50<br>兒童口罩:50</p>');



        //放入跳窗
        // L.marker([22.594714, 120.305904]).addTo(myMap)
        //     .bindPopup('<h1>測試藥局</h1><p>成人口罩：50<br>兒童口罩:50</p>');

        /**/


    };