
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
    northEast = L.latLng(-13.306775722376086, 35.06835937500001),
    bounds = L.latLngBounds(southWest, northEast);

let categories_ = [
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

        L.geoJson(grids_data_2, {
            style: styletobacco
        }).addTo(name);
        function getColor(d) {
            return d > 250000 ? '#016c59' :
                d > 150000 ? '#016c59' :
                d > 50000 ? '#1c9099' :
                d > 20000 ? '#1c9099' :
                d > 10000 ? '#67a9cf' :
                d > 5000 ? '#67a9cf' :
                d > 1000 ? '#bdc9e1' :
                d > 0 ? '#808080' :
                '#808080';
        }

        function styletobacco(feature) {
            return {
                fillColor: getColor(feature.properties.Tobacco),
                weight: 1,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 1
            };
        }
        addLegend([250000, 150000, 50000, 1000], getColor, name)

    } else {
        let parishes_data = L.geoJson(parish_data, {
            style: style_fn
        }).addTo(name);

        parishes_data.eachLayer(function (parish) {
            let parish_ = parish.feature.properties.Name;
            let popup_info = []
            categories_.forEach(category_ => {
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
            parish.on('mouseover', function (e) {
                this.openPopup();
            });
            parish.on('mouseout', function (e) {
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

document.addEventListener('DOMContentLoaded', function () {

    let data_ = []
    parish_data.features.forEach(feature => {
        let parish_crops = {}
        parish_crops["name"] = feature.properties.Name
        parish_crops["data"] = [feature.properties["Tobacco"]]
        data_.push(parish_crops)
    })

    Highcharts.chart('chart_id', {
        chart: {
            type: 'bar'
        },
        title: {
            text: null
        },
        xAxis: {
            title: {
                text: 'Tobacco'
            }
        },
        yAxis: {
            title: {
                text: 'Crops Grown'
            }
        },
        series: data_
    });
});
