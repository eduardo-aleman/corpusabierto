<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>


<script>
    document.addEventListener("DOMContentLoaded", function() {

        // 1. Inicializar el mapa
        const map = L.map("corpus-map", {
            center: [38.0, 24.0],
            zoom: 5,
            zoomControl: true
        });

        // 2. Añadir la capa de mapa base
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd"
        }).addTo(map);

        // 3. Crear grupos de capas para el control
        const featureGroups = {
            Ciudad: L.featureGroup().addTo(map), // Añadir por defecto
            Región: L.featureGroup().addTo(map), // Añadir por defecto
            Isla: L.featureGroup().addTo(map),   // Añadir por defecto
            Río: L.featureGroup().addTo(map)     // Añadir por defecto
        };
        
        // 4. Mapeo de tipos a iconos
        const iconMapping = {
            'Ciudad': 'university',
            'Región': 'map',
            'Isla': 'tree', // Cambié 'water' a 'tree' por consistencia con tu leyenda
            'Río': 'tint'   // Cambié 'tint' por consistencia con tu leyenda
        };

        // 5. Función para obtener el color según la frecuencia
        function getColorByFreq(freq) {
            if (freq >= 16) return 'red';
            if (freq >= 6) return 'orange';
            if (freq >= 2) return 'green';
            return 'blue';
        }

        // 6. Cargar y procesar los datos desde el archivo JSON
        fetch('/mapas/locations.json') // Asegúrate de que la ruta a tu archivo es correcta
            .then(response => response.json())
            .then(data => {
                data.forEach(location => {
                    // Determinar propiedades del marcador
                    const color = getColorByFreq(location.freq);
                    const iconType = iconMapping[location.type] || 'circle'; // 'circle' como icono por defecto

                    // Crear el icono
                    const awesomeIcon = L.AwesomeMarkers.icon({
                        markerColor: color,
                        iconColor: 'white',
                        icon: iconType,
                        prefix: 'fa'
                    });

                    // Crear el marcador
                    const marker = L.marker([location.lat, location.lng], {
                        icon: awesomeIcon
                    });

                    // Crear y asociar el popup
                    const popupContent = `${location.name} (${location.freq})<br>Tipo: ${location.type}`;
                    marker.bindPopup(popupContent);

                    // Añadir el marcador al grupo de capas correspondiente
                    if (featureGroups[location.type]) {
                        featureGroups[location.type].addLayer(marker);
                    }
                });
            })
            .catch(error => console.error('Error al cargar el archivo de localizaciones:', error));

        // 7. Añadir el control de capas al mapa
        L.control.layers(null, featureGroups, {
            position: 'topright',
            collapsed: false
        }).addTo(map);
    });
</script>