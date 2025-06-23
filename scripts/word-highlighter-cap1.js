javascript
/* Archivo: /scripts/word-highlighter-cap1.js */

/**
 * Envuelve el contenido de un contenedor en <span class="word">,
 * asignando data-index a cada token. Si ya existen spans.word, no vuelve a envolver.
 * (En el capítulo 1 los spans ya están presentes, así que wrapWords solo actúa si los quitas.)
 */
function wrapWords(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`No existe el contenedor #${containerId}`);
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

/**
 * Elimina la clase .highlight de todos los elementos que la tuvieran.
 */
function clearHighlights() {
  document.querySelectorAll('.highlight')
          .forEach(el => el.classList.remove('highlight'));
}

/**
 * Activa el resaltado y desplazamiento suave al elemento emparejado:
 * - data-map ➔ resalta todos los IDs listados y hace scroll
 * - id="w#"/"t#" ➔ empareja directamente palabra a palabra
 * - data-index ➔ resalta por posición (fallback)
 */
function enableHighlightCap1() {
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', () => {
      clearHighlights();

      // 1) traducciones manuales: data-map="w4" etc.
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

      // 2) emparejamiento palabra-por-palabra por ID (w# <-> t#)
      if (word.id) {
        // Si id empieza por 'w', buscamos el 't' correspondiente, y viceversa
        const prefix = word.id.charAt(0);
        const num    = word.id.slice(1);
        const otherId = (prefix === 'w' ? 't' : 'w') + num;
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

      // 3) fallback: correspondencia por índice en texto paralelo
      if (word.dataset.index) {
        document
          .querySelectorAll(`.word[data-index="${word.dataset.index}"]`)
          .forEach(span => span.classList.add('highlight'));
      }
    });
  });
}

// Inicialización al cargar la página (solo capítulo 1)
document.addEventListener('DOMContentLoaded', () => {
  wrapWords('greekText');
  wrapWords('spanishText');
  enableHighlightCap1();
  console.log('word-highlighter-cap1 inicializado');
});