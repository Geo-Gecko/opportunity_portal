
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
    northEast = L.latLng(-13.306775722376086, 35.06835937500001),
    bounds = L.latLngBounds(southWest, northEast);

let categories = [
    "Tobacco", "Soybean", "Maize" /*"Bareland"*/
    // "Forest", "Other vegetation", 
]
let maps = ["map1", "map2"]
let map1_, map2_;

maps.forEach(map_ => {
    let name = window[`${map_}_`]
    name = L.map(map_, {
        maxBounds: bounds,
        minZoom: 9,
    }).setView([-14, 33.4], 9);

    L.tileLayer.colorFilter('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        filter: ['grayscale:100%'],
    }).addTo(name);

    if (map_ === "map1") {
        name.createPane('classification_2019_2020');
        name.getPane('classification_2019_2020').style.zIndex = 850;
        L.tileLayer.wms('http://geogecko.gis-cdn.net/geoserver/gg/wms?', {
            layers: 'gg:gg_data',
            dim_location: '2019_2020_opportunity_classification.tiff',
            transparent: true,
            format: 'image/png',
            pane: 'classification_2019_2020'
        }).addTo(name)

        let legend = L.control({ position: 'bottomright' });


        legend.onAdd = function () {

            let div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<i style="background:#6ee16e"></i>Tobacco<br>';

            return div;
        };

        legend.addTo(name);
    } else {
        let parishes_data = L.geoJson(parish_data, {
          style: style_fn
        }).addTo(name);
      
        parishes_data.eachLayer(function(parish) {
          let parish_ = parish.feature.properties.Name;
          let popup_info = []
          categories.forEach(category_ => {
            let number_ = parish.feature.properties[category_]
            number_ = number_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            popup_info.push(
              `<br><strong>${category_}:</strong>${number_}`
            )
          })
          parish.bindPopup(
            `<strong>Parish:</strong>${parish_ + popup_info.join("")}`, {
              autoPan: false
            }
          );
          parish.on('mouseover', function(e) {
            this.openPopup();
          });
          parish.on('mouseout', function(e) {
            this.closePopup();
          });
        });
      
        function style_fn(feature) {
            return {
                fillColor: '#fecc5c',
                weight: 1,
                opacity: 0.5,
                color: 'black',
                dashArray: '0',
                fillOpacity: 1
            };
        }
    }

})
