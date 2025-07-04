// assets/js/nav-collapse.js

document.addEventListener('DOMContentLoaded', () => {

    // Selecciona los elementos por los IDs que pusimos en el HTML
    const nav = document.querySelector('.chapter-nav');
    const toggleButton = document.getElementById('toggle-nav-btn');
    const chapterLinks = document.querySelectorAll('.chapter-nav a');

    // Si la navegación de capítulos existe en la página actual...
    if (nav && toggleButton) {
        
        // 1. Funcionalidad para el botón de colapso/expansión
        toggleButton.addEventListener('click', () => {
            nav.classList.toggle('collapsed');
        });

        // 2. Funcionalidad para colapsar al seleccionar un enlace (útil en móviles)
        chapterLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Solo colapsar en pantallas pequeñas para una mejor experiencia de usuario
                if (window.innerWidth <= 768) {
                    nav.classList.add('collapsed');
                }
            });
        });

        // 3. Opcional: Colapsar el nav por defecto en móviles al cargar la página
        if (window.innerWidth <= 768) {
            nav.classList.add('collapsed');
        }
    }
});