

function getColor20202019(d) {
    return d > 150000 ? '#016c59' :
        d > 149999 ? '#016c59' :
        d > 10000 ? '#1c9099' :
        d > 19999 ? '#1c9099' :
        d > 5000 ? '#67a9cf' :
        d > 4999 ? '#67a9cf' :
        d > 1000 ? '#bdc9e1' :
        d > 999 ? '#bdc9e1' :
        d > 1 ? '#f6eff7' :
        d > -1 ? '#f6eff7' :
        d > null ? '#808080' :
        '#808080';
}
function getParishColor20202019(d) {
return d > 250000 ? '#016c59' :
  d > 249999 ? '#016c59' :
  d > 150000 ? '#1c9099' :
  d > 149999 ? '#1c9099' :
  d > 50000 ? '#67a9cf' :
  d > 49999 ? '#67a9cf' :
  d > 1000 ? '#bdc9e1' :
  d > 999 ? '#bdc9e1' :
  d > 1 ? '#f6eff7' :
  d > -1 ? '#f6eff7' :
  d > null ? '#808080' :
  '#808080';
}



function getColor20192018(d) {
    return d > 1000 ? '#016c59' :
        d > 999 ? '#016c59' :
        d > 700 ? '#1c9099' :
        d > 699 ? '#1c9099' :
        d > 300 ? '#67a9cf' :
        d > 299 ? '#67a9cf' :
        d > 100 ? '#bdc9e1' :
        d > 99 ? '#bdc9e1' :
        d > 1 ? '#f6eff7' :
        d > -1 ? '#f6eff7' :
        d > null ? '#808080' :
        '#808080';
}

function getParishColor20192018(d) {
return d > 10000 ? '#016c59' :
  d > 9999 ? '#016c59' :
  d > 5000 ? '#1c9099' :
  d > 4999 ? '#1c9099' :
  d > 3000 ? '#67a9cf' :
  d > 2999 ? '#67a9cf' :
  d > 1000 ? '#bdc9e1' :
  d > 999 ? '#bdc9e1' :
  d > 500 ? '#f6eff7' :
  d > -1 ? '#f6eff7' :
  d > null ? '#808080' :
  '#808080';
}


function style_epas_districts(feature) {
  return {
      fillColor: 'blue',
      weight: 1,
      opacity: 1.5,
      color: 'red',
      fillOpacity: 1.7
  };
}

