document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("corpus-map", {
    center: [38.0, 24.0],
    zoom: 5.5,
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
    "Isla": L.featureGroup().addTo(map),
    "Río": L.featureGroup().addTo(map)
  };

  const iconMapping = {
    'Ciudad': 'university',
    'Región': 'map',
    'Isla': 'tree',
    'Río': 'tint'
  };

  function getColorByFreq(freq) {
    if (freq >= 16) return 'red';
    if (freq >= 6) return 'orange';
    if (freq >= 2) return 'green';
    return 'blue';
  }

  fetch('/data/locations.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar locations.json. Estado: ' + response.status);
      }
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
        const marker = L.marker([location.lat, location.lng], { icon: awesomeIcon });
        const popupContent = `<b>${location.name}</b> (${location.freq})<br>Tipo: ${location.type}`;
        marker.bindPopup(popupContent);
        if (featureGroups[location.type]) {
          featureGroups[location.type].addLayer(marker);
        }
      });
    })
    .catch(error => {
      console.error('Error al procesar el mapa:', error);
      document.getElementById('corpus-map').innerHTML =
        `<div class="alert alert-danger m-3">Error: No se ha podido cargar el mapa. Verifique la consola del navegador.</div>`;
    });

  L.control.layers(null, featureGroups, {
    position: 'topright',
    collapsed: false
  }).addTo(map);
});