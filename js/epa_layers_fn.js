
function generate_epa_layer(year_data, categories_, name) {
  let baseMaps = {}, mapLegend
  Object.keys(year_data).forEach(key_ => {
    let parishes_data = L.geoJson(year_data[key_]["data"], {
        style: style_fn
    });

    parishes_data.eachLayer(function (parish) {
      let parish_ = parish.feature.properties.Name;
      let popup_info = []
      categories_.forEach(category_ => {
          let number_ = parish.feature.properties[category_]
          number_ = number_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          popup_info.push(
              `<br><strong>${category_}: </strong>${
                categories_.length === 1 ? number_ + " difference in" : number_ + ""
              } sqm`
          )
      })
      parish.bindPopup(
          `<strong>EPA:</strong>${parish_ + popup_info.join("")}`, {
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
  let initial_display = Object.keys(year_data).reverse()[0]
  baseMaps[initial_display].addTo(name)
  L.control.layers(
      baseMaps, {}, { collapsed: false, sortLayers: true }
  ).addTo(name);
  mapLegend = addLegend(
      year_data[[Object.keys(year_data)[0]]]["legendramp"],
      year_data[[Object.keys(year_data)[0]]]["colorfn"], name, mapLegend
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
