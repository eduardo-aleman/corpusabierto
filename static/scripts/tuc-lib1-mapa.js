document.addEventListener("DOMContentLoaded", function() {

  const map = L.map("corpus-map", {
    center: [38.0, 24.0],
    zoom: 5.5,
    zoomControl: true,
    scrollWheelZoom: false // Buena práctica para evitar zoom accidental al hacer scroll
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    minZoom: 4,
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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

  async function loadMapData() {
    try {
      // La ruta a 'locations.json' es relativa a la página HTML que la llama
      const response = await fetch('locations.json');
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      
      data.forEach(location => {
        const color = getColorByFreq(location.freq);
        const iconType = iconMapping[location.type] || 'circle'; // 'circle' como ícono por defecto
        
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

    } catch (error) {
      console.error('Error al cargar los datos del mapa:', error);
      document.getElementById('corpus-map').innerHTML = 
        `<div class="alert alert-danger m-3" role="alert">
          <strong>Error:</strong> No se ha podido cargar la información del mapa. Por favor, intente recargar la página.
         </div>`;
    }
  }

  loadMapData();

  L.control.layers(null, featureGroups, {
    position: 'topright',
    collapsed: false
  }).addTo(map);
});