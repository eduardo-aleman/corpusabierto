/**
 * Envuelve las palabras del contenido de texto de un contenedor en <span class="word">,
 * asignando data-index a cada token.
 * ESTA VERSIÓN FINAL respeta los párrafos (<p>) generados por Hugo.
 */
function wrapWords(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Contenedor no encontrado: #${containerId}`);
    return;
  }
  if (container.querySelector('span.word')) {
    console.log(`Contenido de #${containerId} ya procesado.`);
    return; // Prevenir doble procesamiento
  }

  // Encontramos todos los párrafos dentro del contenedor.
  const paragraphs = container.querySelectorAll('p');
  let wordCounter = 0; // Un contador global para data-index

  // Si no hay párrafos, no hacemos nada.
  if (paragraphs.length === 0) {
    console.warn(`No se encontraron párrafos <p> en #${containerId} para procesar.`);
    return;
  }

  paragraphs.forEach(p => {
    // Tomamos el texto plano del párrafo
    const text = p.textContent.trim();
    if (!text) return; // Omitir párrafos vacíos

    const words = text.split(/\s+/);
    
    // Vaciamos el párrafo original para rellenarlo de nuevo
    p.innerHTML = ''; 

    words.forEach(wordText => {
      const span = document.createElement('span');
      span.className = 'word';
      span.dataset.index = wordCounter++;
      span.textContent = wordText;
      
      p.appendChild(span);
      // Añadimos un espacio después de cada palabra
      p.appendChild(document.createTextNode(' ')); 
    });
  });
}