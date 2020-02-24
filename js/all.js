    // 跟第一行是同樣效果的是建立流程不同
    window.onload = function() {

        loader();
        getTime();

        //下拉選單
        let citySearch = document.querySelector('.city-search');
        let distSearch = document.querySelector('.dist-search');
        //js_filter
        let filterMask = document.querySelectorAll('.js_filter');
        let data;
        /*this 推拉button  */
        var toggle_btn = document.querySelector('.js_toggle');

        var panel = document.querySelector('.m-panel');
        toggle_btn.onclick = function(e) {
            // e.preventDefault();
            panel.classList.toggle("menu-off");

        };

        var myMap = L.map('map').setView([22.595551, 120.306945], 14);



        //building map==================================
        var OpenStreetMap_BlackAndWhite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
            maxZoom: 16,
            errorTilrUrl: '',
            attribution: 'Map data: © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

        OpenStreetMap_BlackAndWhite.addTo(myMap);
        L.control.zoom({
            position: 'topright'
        }).addTo(myMap);

        var blueIcon = new L.Icon({
            iconUrl: '../img/blue_icon.png',
            // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [32, 32],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
                // shadowSize: [41, 41]
        });

        var redIcon = new L.Icon({
            iconUrl: '../img/red_icon.png',
            // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [32, 32],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
                // shadowSize: [41, 41]
        });

        var blackIcon = new L.Icon({
            iconUrl: '../img/black_icon.png',
            // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [32, 32],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
                // shadowSize: [41, 41]
        });


        var markers = new L.markerClusterGroup().addTo(myMap);

        //show alert if locate error
        myMap.on('locationerror', onLocationError);
        //find your location
        myMap.on('locationfound', onLocationFound);

        //default locate============================
        function onLocationFound(e) {
            let radius = e.accuracy;
            let currentLocat = new L.MarkerClusterGroup().addTo(myMap);
            currentLocat.addLayer(L.marker(e.latlng).addTo(myMap)
                .bindPopup("您目前的位置").openPopup());
            L.circle(e.latlng, radius).addTo(myMap);
            myMap.setView(e.latlng, 14);
        }
        //alert location error======================
        function onLocationError(e) {
            e.message = "無法使用GPS抓取您的位置，請開啟GPS功能後，重新整理頁面。"
            alert(e.message);
        }
        //  投入真正的資料
        var xhr = new XMLHttpRequest();
        //JSON.parse 
        // http: //localhost:5500/points.json

        xhr.open("GET", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", true);
        xhr.send();
        xhr.addEventListener('load', function() {
            loaderDone();
            filterEvent();
            data = JSON.parse(this.responseText).features;
            var list = document.querySelector('.e-search-body-scroll');
            var str = '';
            selectCountry();
            getList('大安區', '臺北市');


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


            //篩選口罩數量 |監聽 ＝＝＝＝ 3button


            function filterEvent() {
                for (let i = 0; i < filterMask.length; i++) {
                    filterMask[i].addEventListener('click', QueueMask);

                }

            }
            //篩選口罩數量 |重排
            function QueueMask(e) {
                let btnid = String(e.target.value);
                let countryVal = citySearch.value;
                let zoneVal = distSearch.value;
                let maskFilter = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].properties.county == countryVal && data[i].properties.town == zoneVal) {
                        maskFilter.push({
                            mask_adult: data[i].properties.mask_adult,
                            mask_child: data[i].properties.mask_child,
                            mask_all: data[i].properties.mask_child + data[i].properties.mask_adult,
                            name: data[i].properties.name,
                            phone: data[i].properties.phone,
                            address: data[i].properties.address
                        });
                    }
                }
                // console.log(btnid);
                // console.log(btnid == 'mask__child');
                if (btnid == '兒童口罩') {
                    // console.log(1);
                    maskFilter = maskFilter.sort((a, b) => {
                        // console.log(a, b)
                        return a.mask_child > b.mask_child ? -1 : 1;
                        //口罩由大排到小

                    });
                    // console.log(maskFilter);
                    getListFilter(maskFilter);
                } else {
                    maskFilter = maskFilter.sort((a, b) => {
                        return a.mask_adult > b.mask_adult ? -1 : 1;

                    });
                    // console.log('2');
                    getListFilter(maskFilter);

                }
            }

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
                var pharmacyName = document.querySelectorAll('.pharmacy-name'); //藥局名
                var pharmacyNameList = document.querySelectorAll('.pharmacy-wrap'); //藥局block
                localPlaceEvent(pharmacyName, pharmacyNameList);
            }


            function getListFilter(maskFilter) {
                console.log(maskFilter);
                if (citySearch.value == "" || distSearch.value == "") { return };
                let str = `<li class="search-title">- 以下為${citySearch.value}${distSearch.value}內的藥局 --</li>`;
                maskFilter.forEach(mask => {
                    if (mask.mask_adult >= 50) {
                        popAdult = 'bg--nice';
                    } else if (mask.mask_adult < 50 && mask.mask_adult != 0) {
                        popAdult = 'bg--danger';
                    }
                    // 小孩口罩
                    if (mask.mask_child >= 50) {
                        popChild = 'bg--nice';
                    } else if (mask.mask_child < 50 && mask.mask_child != 0) {
                        popChild = 'bg--danger';
                    } else {
                        popChild = 'bg--none';
                    }
                    str += `
                        <li class="pharmacy-wrap eumorphism">
                            <h3 class="pharmacy-name">${mask.name} </h3>               
                            <p><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com.tw/maps/place/${mask.name}" class="address" target="_blank">${mask.address}</a></p> 
                            <p><i class="fa fa-phone"></i> ${mask.phone}</p>
                                <div class= "e-mask-wrap">
                            <div class= "mask adult-mask  ${popAdult}"> 
                            <img src= "img/boy.svg" alt ="成人口罩"class= "e-img mask-img">
                            <p>:${mask.mask_adult} </p>
                            </div>
                            <div class= "mask child-mask ${popChild}" >
                            <img src= "img/baby.svg" alt = "兒童口罩"class= "e-img mask-img">
                                <p>：${mask.mask_child}</p> 
                            </div>
                        </div>
                        </li>
                        `;
                })
                list.innerHTML = str;
                var pharmacyName = document.querySelectorAll('.pharmacy-name'); //藥局名
                var pharmacyNameList = document.querySelectorAll('.pharmacy-wrap'); //藥局block
                localPlaceEvent(pharmacyName, pharmacyNameList);

            }



            function localPlaceEvent(pharmacyName, pharmacyNameList) {
                for (let i = 0; i < pharmacyName.length; i++) {
                    // console.log(pharmacyName.length);
                    pharmacyNameList[i].addEventListener('click', localPlaceFind);
                };
            }

            function localPlaceFind(e) {
                let name = e.path[1].firstElementChild.innerText;
                let local;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].properties.name == name) {
                        console.log(name);
                        local = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]];
                        myMap.setView(local, 20).openPopup();
                    }
                }

                // console.log(local)

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
                    mask = blueIcon;
                } else if (mask_adult + mask_child < 100 && mask_adult + mask_child != 0) {
                    mask = redIcon;
                } else {
                    mask = blackIcon;
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


            }


            // 事件更新


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
            document.querySelector(".m-panel").style.zIndex = 9999;
            document.querySelector("body").style.overflow = "auto";
        }








    };