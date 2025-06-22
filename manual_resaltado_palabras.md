# Guía de integración del script de resaltado de palabras

A continuación, los pasos manuales para integrar y probar el script de resaltado de palabras en tu página.

## 1. Prepara tu HTML

- Crea dos contenedores en el cuerpo de tu HTML:
  ```html
  <div id="greekText">
    <!-- Aquí irá tu texto en griego, con <br> donde corresponda -->
  </div>

  <div id="spanishText">
    <!-- Aquí la traducción al español, también con <br> -->
  </div>
  ```
- Asegúrate de que los IDs (`greekText` y `spanishText`) coincidan con los que usa el script.

## 2. Añade estilos CSS básicos

En el `<head>` o en tu hoja de estilos define:
```css
.word {
  cursor: pointer;            /* Indica interactividad */
}
.highlight {
  background-color: yellow;   /* Color de resaltado */
}
```

## 3. Inserta el script JavaScript

Justo antes de `</body>`, añade:
```html
<script>
// 1) Función wrapWords
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

// 2) Función enableHighlight
function enableHighlight() {
  document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', () => {
      document.querySelectorAll('.highlight').forEach(h => h.classList.remove('highlight'));
      const idx = word.dataset.map || word.dataset.index;
      document.querySelectorAll(`.word[data-index="${idx}"]`).forEach(span => {
        span.classList.add('highlight');
      });
    });
  });
}

// 3) Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  wrapWords('greekText');
  wrapWords('spanishText');
  enableHighlight();
});
</script>
```

## 4. Rellena tus contenedores de texto

- Copia y pega el texto original en griego dentro de `<div id="greekText">…</div>`, usando `<br>` para saltos de línea.
- Copia la traducción al español en `<div id="spanishText">…</div>`.

## 5. Carga la página y verifica

- Abre el HTML en tu navegador.
- En la consola (F12 → Console), asegura que no haya errores de JavaScript.

## 6. Prueba la funcionalidad

- Haz clic en una palabra de cualquiera de los bloques.
- Todas las palabras con el mismo índice (`data-index`) se resaltarán.

## 7. Depuración y ajustes

- Verifica los IDs de los `<div>`.
- Confirma que el `<script>` esté después de los `<div>` o use `DOMContentLoaded`.
- Asegúrate de que los contenedores solo contengan texto y `<br>`.

## 8. Personaliza (opcional)

- Para mapeos avanzados griego ↔ español, añade `span.dataset.map = i` al crear los spans.
- Ajusta colores y estilos en tu CSS según tus preferencias.
