// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los elementos necesarios del DOM
    const expandIcons = document.querySelectorAll('.expand-icon');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // Función para abrir el modal
    const openModal = (title, content) => {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalContainer.classList.add('is-visible');
        document.body.classList.add('modal-open');
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modalContainer.classList.remove('is-visible');
        document.body.classList.remove('modal-open');
    };

    // Añadir un listener a cada ícono de "expandir"
    expandIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar que el enlace navegue

            // Encontrar el contenedor padre más cercano
            const container = event.currentTarget.closest('.info-container');
            
            // Extraer el título y el contenido
            const title = container.querySelector('h3').textContent;
            const content = container.querySelector('.info-content').innerHTML;

            // Abrir el modal con el contenido extraído
            openModal(title, content);
        });
    });

    // Añadir listener al botón de cierre del modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Añadir listener para cerrar el modal al hacer clic en la capa oscura
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            // Si el clic fue en el contenedor (capa oscura) y no en un hijo
            if (event.target === modalContainer) {
                closeModal();
            }
        });
    }

    // Añadir listener para cerrar el modal con la tecla 'Escape'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            closeModal();
        }
    });
});