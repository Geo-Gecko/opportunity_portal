
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
    northEast = L.latLng(-13.306775722376086, 35.06835937500001),
    bounds = L.latLngBounds(southWest, northEast);

let categories_ = [
    "Tobacco", "Soybean", "Maize" /*"Bareland"*/
    // "Forest", "Other vegetation",
]
let maps = ["map0", "map1", "map2"]
let map0_, map1_, map2_;

maps.forEach(map_ => {
    let mapLegend;
    let name = window[`${map_}_`]
    name = L.map(map_, {
        maxBounds: bounds,
        minZoom: 9,
    }).setView([-14, 33.4], 9);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        filter: ['grayscale:100%'],
    }).addTo(name);

    if (map_ === "map0") {
        L.geoJson(tobacco_fields, {
            style: "#016c59"
        }).addTo(name);
        setTimeout(function () {
            name.flyTo([-14.27, 33.77], 11, {
              animate: true,
              duration: 1.0
            });
        }, 1000)

    } else if (map_ === "map1") {
        let year_data = {
            "2020-2019": {
                data: "parish_grid_data_2020_2019", colorfn: getColor20202019,
                legendramp: [150000, 10000, 5000, 1000, 1]
            },
            "2019-2018": {
                data: "parish_grid_data_2019_2018", colorfn: getColor20192018,
                legendramp: [1000, 700, 300, 100, 1]
            },
            "2018-2017": {
                data: "parish_grid_data_2018_2017", colorfn: getColor20202019,
                legendramp: [150000, 10000, 5000, 1000, 1]
            }
        }
        let baseMaps = {}

        Object.keys(year_data).forEach(key_ => {
            let tile_ = L.geoJson(eval(year_data[key_]["data"]), {
                style: styletobacco
            });

            function styletobacco(feature) {
                return {
                    fillColor: year_data[key_]["colorfn"](feature.properties.Tobacco),
                    weight: 1,
                    opacity: 1,
                    color: 'black',
                    dashArray: '0',
                    fillOpacity: 1
                };
            }
            baseMaps[key_] = tile_
        })
        baseMaps["2020-2019"].addTo(name)
        L.control.layers(baseMaps, {}, { collapsed: false }).addTo(name);
        mapLegend = addLegend(
            [150000, 10000, 5000, 1000, 1],
            getColor20202019, name, mapLegend
        )
        name.on('baselayerchange', function (eventLayer) {
            if (mapLegend && mapLegend._map) {
                name.removeControl(mapLegend);
            }
            mapLegend = addLegend(
                year_data[eventLayer.name]["legendramp"],
                year_data[eventLayer.name]["colorfn"],
                name, mapLegend
            )
        })

    } else if (map_ === "map2") {
        let year_data = {
            "2020-2019": {
                data: "parish_data_2020_2019", colorfn: getParishColor20202019,
                legendramp: [2500000, 150000, 50000, 1000, 1]
            },
            "2019-2018": {
                data: "parish_data_2019_2018", colorfn: getParishColor20192018,
                legendramp: [10000, 5000, 3000, 1000, 1]
            },
            "2018-2017": {
                data: "parish_data_2018_2017", colorfn: getParishColor20202019,
                legendramp: [2500000, 150000, 50000, 1000, 1]
            }
        }
        let baseMaps = {}
        Object.keys(year_data).forEach(key_ => {
            let parishes_data = L.geoJson(eval(year_data[key_]["data"]), {
                style: style_fn
            });

            parishes_data.eachLayer(function (parish) {
                let parish_ = parish.feature.properties.Name;
                let popup_info = []
                categories_.forEach(category_ => {
                    let number_ = parish.feature.properties[category_]
                    number_ = number_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    popup_info.push(
                        `<br><strong>${category_}:</strong>${number_} sqkm`
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
                    fillColor: year_data[key_]["colorfn"](feature.properties.Tobacco),
                    weight: 1,
                    opacity: 0.5,
                    color: 'black',
                    dashArray: '0',
                    fillOpacity: 1
                };
            }
            baseMaps[key_] = parishes_data
        })
        baseMaps["2020-2019"].addTo(name)
        L.control.layers(baseMaps, {}, { collapsed: false }).addTo(name);
        mapLegend = addLegend(
            [250000, 150000, 50000, 1000, 1],
            getParishColor20202019, name, mapLegend
        )
        name.on('baselayerchange', function (eventLayer) {
            if (mapLegend && mapLegend._map) {
                name.removeControl(mapLegend);
            }
            mapLegend = addLegend(
                year_data[eventLayer.name]["legendramp"],
                year_data[eventLayer.name]["colorfn"],
                name, mapLegend
            )
        })
    }

})

document.addEventListener('DOMContentLoaded', function () {

    let seriesData_ = [], parishes_ = [],
        data2020object_ = {"name": 2020, "data": []},
        data2019object_ = {"name": 2019, "data": []},
        data2018object_ = {"name": 2018, "data": []}
    parish_data_2020_2019.features.forEach(feature => {
        parishes_.push(feature.properties.Name)
        data2020object_["data"].push(feature.properties.Tobacco)
    })
    parish_data_2019_2018.features.forEach(feature => {
        data2019object_["data"].push(feature.properties.Tobacco)

    })
    parish_data_2018_2017.features.forEach(feature => {
        data2018object_["data"].push(feature.properties.Tobacco)
    })

    Highcharts.chart('chart_id', {
        chart: {
            type: 'bar'
        },
        title: {
            text: "Chart Of Tobacco Growing Areas Per Parish for 2020",
            style: {
                "color": "#333333", "fontSize": "1.5rem",
                "fontFamily": '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",\
                Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",\
                "Noto Color Emoji";',
                "fontWeight": "bold"
            }
        },
        xAxis: {
            categories: parishes_,
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: "Tobacco grown(square kilometers)",
                align: "high"
            }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          shadow: true
        },
        series: [data2020object_, data2019object_, data2018object_],
    });
});
