    /*var myMap = L.map('map', {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                center: [22.595551, 120.306945],

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                zoom: 15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
    // 跟第一行是同樣效果的是建立流程不同
    window.onload = function() {

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

        xhr.open("GET", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
        xhr.send();
        xhr.addEventListener('load', function() {
            var data = JSON.parse(this.responseText).features;
            for (var i = 0; i < data.length; i++) {
                var mask;
                if (data[i].properties.mask_adult == 0 || data[i].properties.mask_child == 0) {
                    mask = blockIcon;
                } else {
                    mask = yellowIcon;
                }
                markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: mask }).bindPopup(`<b>${data[i].properties.name}</b><p>成人口罩:${data[i].properties.mask_adult}<br>兒童口罩:${data[i].properties.mask_child}</p>`));


            }
            myMap.addLayer(markers);

        });
        // var data = JSON.parse(xhr.responseText).features;


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



    };