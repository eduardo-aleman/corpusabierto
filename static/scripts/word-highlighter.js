/* Archivo: /scripts/word-highlighter.js */

/**
 * Envuelve el contenido de un contenedor en <span class="word">,
 * asignando data-index a cada token. Si ya existen spans.word, no vuelve a envolver.
 */
function wrapWords(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`No existe el contenedor #${containerId}`);
    return;
  }
  if (container.querySelector('span.word')) return;  // ya envuelto

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

/**
 * Quita la clase .highlight de todos los elementos que la tuvieran.
 */
function clearHighlights() {
  document.querySelectorAll('.highlight')
          .forEach(el => el.classList.remove('highlight'));
}

/**
 * Activa el resaltado y scroll al elemento emparejado:
 * - data-map ➔ resalta todos los IDs listados y hace scroll
 * - id="w#_##" o "t#_##" ➔ usa regex para emparejar el otro prefijo
 * - data-index ➔ resalta por posición
 */
function enableHighlight() {
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', () => {
      clearHighlights();

      // 1) traducciones manuales: data-map="t2_3,t2_4"
      if (word.dataset.map) {
        word.dataset.map.split(',').forEach(id => {
          const tgt = document.getElementById(id.trim());
          if (tgt) {
            tgt.classList.add('highlight');
            tgt.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }

      // 2) emparejamiento griego<->español por ID (w#_## <-> t#_##)
      if (word.id) {
        const m = word.id.match(/^([wt])(\d+)_(\d+)$/);
        if (m) {
          const [, prefix, cap, par] = m;
          const otherPrefix = prefix === 'w' ? 't' : 'w';
          const otherId = `${otherPrefix}${cap}_${par}`;
          const otherSpan = document.getElementById(otherId);

          // resaltamos el clicado
          word.classList.add('highlight');

          if (otherSpan) {
            otherSpan.classList.add('highlight');
            otherSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            console.warn(`No encontrado par para id ${word.id}`);
          }
          return;
        }
      }

      // 3) correspondencia por índice en texto paralelo
      if (word.dataset.index) {
        document
          .querySelectorAll(`.word[data-index="${word.dataset.index}"]`)
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
