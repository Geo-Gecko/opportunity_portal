function thousep2(n) {
  if (typeof n === 'number') {
    n += '';
    let x = n.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  } else {
    return n;
  }
}


function addLegend(grades, ramp, map, mapLegend) {
  mapLegend = L.control({ position: 'bottomright' });

  mapLegend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += "<p><b>Tobacco Grown</b></p>";
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + ramp(grades[i]) + '"></i> ' +
        thousep2(grades[i]) + (grades[i + 1] ? '&ndash;' + thousep2(grades[i + 1]) + ' sqm' + '<br>' : '+ sqm');
    }

    return div;
  };

  return mapLegend.addTo(map);

}


function totalGridTobacco (year, totalArea) {
  let control_ = L.control({ position: 'bottomleft' });
  control_.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += `Tobacco Grown in ${year}: ${thousep2(totalArea)} sqm`;
    return div
  }
  return control_
}
