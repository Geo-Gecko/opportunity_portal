
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
northEast = L.latLng(-13.306775722376086, 35.06835937500001),
bounds = L.latLngBounds(southWest, northEast);


let map = L.map('map', {
    maxBounds: bounds,
    minZoom: 9,
    maxZoom: 9
  }).setView([-14, 33.4], 9);
// map.fitBounds(bounds)

L.tileLayer.colorFilter('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    filter: ['grayscale:100%'],
}).addTo(map);


// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//     attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
// }).addTo(map);

map.on('moveend', function() {
    console.log(map.getBounds())
});

map.createPane('classification_2019_2020');
map.getPane('classification_2019_2020').style.zIndex = 850;
var classification_2019_2020 = L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    layers: 'opportunity:27_sunday_classn_for_2019_2020',
    styles: '',
    transparent: true,
    format: 'image/png',
    pane: 'classification_2019_2020'
}).addTo(map)

// L.tileLayer.wms('https://geogecko.gis-cdn.net/geoserver/wms?', {
//     layers: 'gg:27_sunday_classn_for_2019_2020',
//     styles: '',
//     transparent: true,
//     format: 'image/png',
//     pane: 'classification_2019_2020'
// }).addTo(map)

// console.log(classification_2019_2020)

// import rasterio
// with rasterio.open('28_monday_classn_for_2019_2018.tiff') as infile:
//     profile=infile.profile
//     profile['driver']='PNG'
//     raster=infile.read()
//     with rasterio.open('28_monday_classn_for_2019_2018.png', 'w', **profile) as dst:
//             dst.write(raster)
