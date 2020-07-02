
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
    northEast = L.latLng(-13.306775722376086, 35.06835937500001),
    bounds = L.latLngBounds(southWest, northEast);

let categories_ = [
    "Tobacco", "Soybean", "Maize" /*"Bareland"*/
    // "Forest", "Other vegetation",
]
let maps = ["map0", "map1", "map2", "map3"]
let map0_, map1_, map2_, map3_;

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
        //crop field map

        let farm_field_data  = {
            "Tobacco": { 
               data: tobacco_fields,
               color: 'yellow'
            },
            "Soybean": {
                data: soybeans_feilds, 
                color: 'yellow'
            },
            "Maize": {
                data: maize_feilds, 
                color: 'yellow'
            },
            "EPAs": {
                data: EPAs_data,
                color: 'red',
                fillColor: 'ffffff00'
            },
            "Districts": {
                data: districts_data,
                color: 'red',
                fillColor: 'ffffff00'
            },
        }

        let baseOne = {}

        Object.keys(farm_field_data).forEach(name_ => {
            let fieldData = L.geoJson(farm_field_data[name_]["data"],{ 
                style: {
                    weight: 1.5,
                    opacity: 1,
                    fillColor: farm_field_data[name_]["fillColor"],
                    color: farm_field_data[name_]["color"]
                } 
            }); 
            fieldData.eachLayer(function (parish) {
 
                if (parish.feature.properties.EPA) {
                    let parish_ = parish.feature.properties.Name;
                    parish.bindPopup(
                        `<strong>EPA:</strong>${parish_}`, {
                        autoPan: false
                    });
                    parish.on('mouseover', function (e) {
                        this.openPopup();
                    });
                    parish.on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
            })         
            baseOne[name_] = fieldData
        });
        baseOne["Tobacco"].addTo(name)
        setTimeout(function () {
            name.flyTo([-14.27, 33.77], 11, {
              animate: true,
              duration: 1.0
            });
        }, 1000)
    
        L.control.layers(
            baseOne, {}, { collapsed: false, sortLayers: true }
        ).addTo(name);

    } else if (map_ === "map1") {
        // grid map
        let year_data = {
            "2020": {
                data: parish_grid_data_2020_2019, colorfn: getColor20202019,
                legendramp: [150000, 10000, 5000, 1000, 1]
            },
            "2019": {
                data: parish_grid_data_2019_2018, colorfn: getColor20202019,
                legendramp: [150000, 10000, 5000, 1000, 1]
            },
            "2018": {
                data: parish_grid_data_2018_2017, colorfn: getColor20202019,
                legendramp: [150000, 10000, 5000, 1000, 1]
            }
        }
        let baseMaps = {}, total_tobacco_obj = {}

        Object.keys(year_data).forEach(key_ => {
            total_tobacco_obj[key_] = 0
            let tile_ = L.geoJson(year_data[key_]["data"], {
                style: styletobacco
            });

            function styletobacco(feature) {
                if (feature.properties.Tobacco){
                    total_tobacco_obj[key_] += feature.properties.Tobacco
                }

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
        baseMaps["2020"].addTo(name)
        L.control.layers(
            baseMaps, {}, { collapsed: false, sortLayers: true }
        ).addTo(name);
        mapLegend = addLegend(
            [150000, 10000, 5000, 1000, 1],
            getColor20202019, name, mapLegend
        )

        let totalTobacco = totalGridTobacco(
            "2020", total_tobacco_obj["2020"]
        )
        totalTobacco.addTo(name)

        name.on('baselayerchange', function (eventLayer) {
            // change legend
            if (mapLegend && mapLegend._map) {
                name.removeControl(mapLegend);
            }
            mapLegend = addLegend(
                year_data[eventLayer.name]["legendramp"],
                year_data[eventLayer.name]["colorfn"],
                name, mapLegend
            )

            // change total tobacco grown
            if (totalTobacco._map) {
                name.removeControl(totalTobacco);
            }
            totalTobacco = totalGridTobacco(
                eventLayer.name, total_tobacco_obj[eventLayer.name]
            ).addTo(name)
        })

    } else if (map_ === "map2") {
        // EPA map
        let year_data = {
            "2020": {
                data: parish_data_2020_2019, colorfn: getParishColor20202019,
                legendramp: [2500000, 150000, 50000, 1000, 1]
            },
            "2019": {
                data: parish_data_2019_2018, colorfn: getParishColor20202019,
                legendramp: [2500000, 150000, 50000, 1000, 1]
            },
            "2018": {
                data: parish_data_2018_2017, colorfn: getParishColor20202019,
                legendramp: [250000, 150000, 50000, 1000, 1]
            }
        }
        generate_epa_layer(year_data, categories_, name)

    } else if (map_ === "map3") {
        // EPA difference map
        let diff_parish_data_2020_2019 = {"type":"FeatureCollection", "features": []}
        let diff_parish_data_2019_2018 = {"type":"FeatureCollection", "features": []}
        parish_data_2020_2019.features.forEach((feature, i) => {
            // spread operator is to allow for a deep copy
            let new_feature = {
                "type": feature.type, "geometry": feature.geometry, "properties": {...feature.properties}
            };
            let diffed_value =
                feature.properties.Tobacco -
                    parish_data_2019_2018.features[i].properties.Tobacco;
            new_feature.properties.Tobacco = diffed_value
            diff_parish_data_2020_2019.features.push(new_feature)
        })
        parish_data_2019_2018.features.forEach((feature, i) => {
            let new_feature = {
                "type": feature.type, "geometry": feature.geometry, "properties": {...feature.properties}
            };
            let diffed_value = 
                feature.properties.Tobacco -
                    parish_data_2018_2017.features[i].properties.Tobacco
            new_feature.properties.Tobacco = diffed_value
            diff_parish_data_2019_2018.features.push(new_feature)
        })
        let year_data = {
            "2020-2019": {
                data: diff_parish_data_2020_2019, colorfn: getdiffParishColor20192018,
                legendramp: [-250000, -150000, 150000, 250000]
            },
            "2019-2018": {
                data: diff_parish_data_2019_2018, colorfn: getdiffParishColor20192018,
                legendramp: [-250000, -150000, 150000, 250000]
            },
        }
        generate_epa_layer(year_data, ["Tobacco"], name)
    }

})
