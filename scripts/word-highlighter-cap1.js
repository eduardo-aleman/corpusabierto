/* Archivo: /scripts/word-highlighter.js */

// Envuelve palabras solo si no hay ya spans.word
function wrapWords(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(No existe el contenedor #${containerId});
    return;
  }
  // Si ya hay spans.word, no envolvemos de nuevo
  if (container.querySelector('span.word')) return;

  const text = container.innerHTML
    .replace(/<br\s*\/?>/gi, ' <br> ')
    .replace(/\s{2,}/g, ' ')
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

// Resalta según data-map, id (bidireccional) o data-index
function enableHighlight() {
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', () => {
      // Limpiar resaltados previos
      document.querySelectorAll('.highlight').forEach(h => h.classList.remove('highlight'));

      // 1) Si clicado en español (tiene data-map), resaltar los destinos en griego
      if (word.dataset.map) {
        word.dataset.map.split(',').forEach(id => {
          const tgt = document.getElementById(id.trim());
          if (tgt) tgt.classList.add('highlight');
        });
      }
      // 2) Si clicado en griego (tiene id pero no data-map), resaltar su traducción en español
      else if (word.id) {
        // (Opcional) resalta también el propio término griego
        word.classList.add('highlight');
        // Buscar todos los spans en español que lo referencian
        document.querySelectorAll('.word[data-map]').forEach(span => {
          const maps = span.dataset.map.split(',').map(s => s.trim());
          if (maps.includes(word.id)) {
            span.classList.add('highlight');
          }
        });
      }
      // 3) Si no tiene ni data-map ni id, cae en data-index
      else if (word.dataset.index) {
        document.querySelectorAll(.word[data-index="${word.dataset.index}"])
                .forEach(span => span.classList.add('highlight'));
      }
    });
  });
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  wrapWords('greekText');
  wrapWords('spanishText');
  enableHighlight();
  console.log('word-highlighter inicializado');
});