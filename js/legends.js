function thousep2(n) {
  if (typeof n === 'number') {
    n += '';
    var x = n.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  } else {
    return n;
  }
}


function addLegend(grades, ramp, map) {
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML += '<p><b>' + "Tobacco Grown" + '</b></p>';
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + ramp(grades[i]) + '"></i> ' +
        thousep2(grades[i]) + (grades[i + 1] ? '&ndash;' + thousep2(grades[i + 1]) + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);

}
