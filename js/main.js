
let southWest = L.latLng(-14.639396280953353, 31.731262207031254),
northEast = L.latLng(-13.306775722376086, 35.06835937500001),
bounds = L.latLngBounds(southWest, northEast);


let map = L.map('map', {
    maxBounds: bounds,
    minZoom: 9,
  }).setView([-14, 33.4], 9);
// map.fitBounds(bounds)

L.tileLayer.colorFilter('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    filter: ['grayscale:100%'],
}).addTo(map);



map.createPane('classification_2019_2020');
map.getPane('classification_2019_2020').style.zIndex = 850;
L.tileLayer.wms('http://geogecko.gis-cdn.net/geoserver/gg/wms?', {
    layers: 'gg:gg_data',
    dim_location: '2019_2020_opportunity_classification.tiff',
    transparent: true,
    format: 'image/png',
    pane: 'classification_2019_2020'
}).addTo(map)

let legend = L.control({ position: 'bottomright' });


legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<i style="background:#6ee16e"></i>Tobacco<br>';

    return div;
  };

legend.addTo(map);
