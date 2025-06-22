
/* Archivo: /scripts/word-highlighter.js */

// Envuelve cada palabra en <span data-index>
function wrapWords(containerId) {
  const container = document.getElementById(containerId);
  const text = container.innerHTML
    .replace(/<br>/g, ' <br> ')
    .replace(/  +/g, ' ')
    .trim();
  const tokens = text.split(' ');
  container.innerHTML = '';
  tokens.forEach((tok, i) => {
    if (tok === '<br>') {
      container.appendChild(document.createElement('br'));
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.dataset.index = i;
      span.textContent = tok;
      container.appendChild(span);
      container.appendChild(document.createTextNode(' '));
    }
  });
}

// Resalta todas las palabras con mismo data-index o data-map
function enableHighlight() {
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', () => {
      // Limpiar resaltados previos
      document.querySelectorAll('.highlight').forEach(h => h.classList.remove('highlight'));
      // Usar data-map si existe, sino data-index
      const idx = word.dataset.map || word.dataset.index;
      // Resaltar todos los spans que coincidan
      document.querySelectorAll(`.word[data-index="${idx}"]`).forEach(span => {
        span.classList.add('highlight');
      });
    });
  });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  wrapWords('greekText');
  wrapWords('spanishText');
  enableHighlight();
});
