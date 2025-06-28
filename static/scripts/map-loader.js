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

  // Objeto para agrupar los marcadores por tipo.
  // Se añaden al mapa desde el principio.
  const featureGroups = {
    "Ciudad": L.featureGroup().addTo(map),
    "Región": L.featureGroup().addTo(map),
    "Isla": L.featureGroup().addTo(map),
    "Río": L.featureGroup().addTo(map)
  };

  // Mapeo de tipo de lugar a ícono de Font Awesome
  const iconMapping = {
    'Ciudad': 'university',
    'Región': 'map',
    'Isla': 'tree',
    'Río': 'tint'
  };

  // Función para determinar el color del marcador según la frecuencia
  function getColorByFreq(freq) {
    if (freq >= 16) return 'red';
    if (freq >= 6) return 'orange';
    if (freq >= 2) return 'green';
    return 'blue';
  }

  // Cargar los datos de las localizaciones desde el archivo JSON
  fetch('/data/locations.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar locations.json. Estado: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Iterar sobre cada localización en los datos
      data.forEach(location => {
        const color = getColorByFreq(location.freq);
        const iconType = iconMapping[location.type] || 'circle'; // Ícono por defecto

        // Crear el ícono personalizado con AwesomeMarkers
        const awesomeIcon = L.AwesomeMarkers.icon({
          markerColor: color,
          iconColor: 'white',
          icon: iconType,
          prefix: 'fa'
        });

        // Crear el marcador y el popup
        const marker = L.marker([location.lat, location.lng], { icon: awesomeIcon });
        const popupContent = `<b>${location.name}</b> (${location.freq})<br>Tipo: ${location.type}`;
        marker.bindPopup(popupContent);

        // Añadir el marcador al grupo de capas correspondiente
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

  // --- SECCIÓN MODIFICADA ---
  // Añadir el control de capas al mapa, posicionándolo en la esquina superior izquierda.
  L.control.layers(null, featureGroups, {
    position: 'topleft', // Cambiado de 'topright' a 'topleft'
    collapsed: false // Mantiene la lista de capas desplegada por defecto
  }).addTo(map);
});