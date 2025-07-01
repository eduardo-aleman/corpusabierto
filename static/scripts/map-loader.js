// static/scripts/map-loader.js

document.addEventListener("DOMContentLoaded", function () {
  // (CAMBIO) Las coordenadas y el zoom ahora se leen de las variables globales
  // en lugar de estar fijos en el código.
  const map = L.map("corpus-map", {
    center: window.MAP_CENTER,
    zoom: window.MAP_ZOOM,
    zoomControl: true
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    minZoom: 4,
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd"
  }).addTo(map);

  const featureGroups = {
    "Ciudad": L.featureGroup().addTo(map),
    "Región": L.featureGroup().addTo(map),
    "Isla":   L.featureGroup().addTo(map),
    "Río":    L.featureGroup().addTo(map)
  };

  const iconMapping = {
    'Ciudad': 'university',
    'Región': 'map',
    'Isla':   'tree',
    'Río':    'tint'
  };

  function getColorByFreq(freq) {
    if (freq >= 16) return 'red';
    if (freq >= 6) return 'orange';
    if (freq >= 2) return 'green';
    return 'blue';
  }

  fetch(window.MAP_DATA_URL)
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar ' + window.MAP_DATA_URL + ' (status ' + response.status + ')');
      return response.json();
    })
    .then(data => {
      data.forEach(location => {
        const color = getColorByFreq(location.freq);
        const iconType = iconMapping[location.type] || 'circle';

        const awesomeIcon = L.AwesomeMarkers.icon({
          markerColor: color,
          iconColor: 'white',
          icon: iconType,
          prefix: 'fa'
        });

        L.marker([location.lat, location.lng], { icon: awesomeIcon })
          .bindPopup(`<b>${location.name}</b> (${location.freq})<br>Tipo: ${location.type}`)
          .addTo(featureGroups[location.type] || featureGroups["Ciudad"]);
      });

      L.control.layers(null, featureGroups, {
        position: 'topleft',
        collapsed: false
      }).addTo(map);
    })
    .catch(error => {
      console.error('Error al procesar el mapa:', error);
      document.getElementById('corpus-map').innerHTML =
        `<div class="alert alert-danger m-3">Error: no se pudo cargar el mapa. Revisa la consola.</div>`;
    });
});