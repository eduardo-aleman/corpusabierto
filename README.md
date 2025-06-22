# README — CorpusAbierto: Plantilla HTML y Script de Correspondencias

Este repositorio contiene una **plantilla HTML** para la publicación interactiva de textos clásicos (griego/latín con traducción al español), acompañada de un **script JavaScript** que resalta palabras correspondientes entre ambos idiomas.

---
## 1. Estructura del Proyecto

- `index.html` (o `capX.html`): Plantilla HTML con:
  - **Navbar** (navegación arriba, descargas, visualizaciones, mapas, GitHub).
  - **Dropdown** de capítulos (Libro I de Tucídides).
  - **Dos paneles**: texto original (`#greekText`) y traducción (`#spanishText`).
  - **Notas críticas** de Alberti y **notas del traductor** de Torres Esbarranch.
  - **Footer** en diseño inverso.
  - **Scripts**:
    - `wrapWords(containerId)` — envuelve cada palabra en `<span data-index>`.
    - `enableHighlight()` — añade el listener para resaltar palabras correspondientes.

- Carpeta `downloads/`: contiene archivos TXT, MD y XML-TEI.

---
## 2. Cómo actualizar las correspondencias de palabras

La interfaz enlaza palabras según su posición (`data-index`). Si tu texto cambia, adapta:

1. **Estructura de HTML**: cada fragmento debe separar palabras con espacios o saltos `<br>`.
2. **Función `wrapWords`**:
   ```js
   function wrapWords(containerId) {
     const container = document.getElementById(containerId);
     const text = container.innerHTML
       .replace(/<br>/g, ' <br> ')
       .replace(/  +/g, ' ')
       .trim();
     const tokens = text.split(' ');
     container.innerHTML = '';
     tokens.forEach((tok, i) => {
       if (tok === '<br>') container.appendChild(document.createElement('br'));
       else {
         const span = document.createElement('span');
         span.className = 'word';
         span.dataset.index = i;
         span.textContent = tok;
         container.appendChild(span);
         container.appendChild(document.createTextNode(' '));
       }
     });
   }
   ```

3. **Función `enableHighlight`**:
   ```js
   function enableHighlight() {
     document.querySelectorAll('#greekText .word').forEach(w => {
       w.addEventListener('click', () => {
         document.querySelectorAll('.highlight').forEach(h => h.classList.remove('highlight'));
         const idx = w.dataset.index;
         w.classList.add('highlight');
         const spanEsp = document.querySelector(
           `#spanishText .word[data-index="${idx}"]`
         );
         if (spanEsp) spanEsp.classList.add('highlight');
       });
     });
   }
   ```

### 2.1 Ejemplo concreto de mapeo manual

Si la correspondencia no es uno a uno, puedes usar `data-map`:

```html
<!-- En griego -->
<span class="word" data-index="5">λόγος</span>

<!-- En español, palabra en posición diferente -->
<span class="word" data-index="8" data-map="5">palabra</span>
```

Y actualizar `enableHighlight`:

```js
function enableHighlight() {
  document.querySelectorAll('#greekText .word').forEach(w => {
    w.addEventListener('click', () => {
      document.querySelectorAll('.highlight').forEach(h => h.classList.remove('highlight'));
      const idx = w.dataset.map || w.dataset.index;
      w.classList.add('highlight');
      const spanEsp = document.querySelector(
        `#spanishText .word[data-index="${idx}"]`
      );
      if (spanEsp) spanEsp.classList.add('highlight');
    });
  });
}
```

---
## 3. Cómo usar la plantilla

1. Clona el repositorio:
   ```bash
   git clone https://github.com/eduardo-aleman/corpusabierto
   cd repositorio
   ```
2. Copia `cap1.html` y renómbralo según capítulo.
3. Edita texto y notas en los bloques:
   - `<div id="greekText">...</div>`
   - `<div id="spanishText">...</div>`
   - Bloques `.notes-container`.
4. Coloca los archivos TXT/MD/XML en `downloads/` y ajusta enlaces en el pie.
5. Sube al servidor y abre en navegador.

---
## 4. Futuros desarrollos

- **Búsqueda**: filtro y autocompletado de términos.
- **Anotaciones enriquecidas**: tooltips, enlaces a diccionarios.
- **Automatización**: generar XML-TEI a partir de Markdown.
- **Accesibilidad**: navegación por teclado y ARIA.
- **Multitext**: manejar varias traducciones simultáneas.

---
*Creado por CorpusAbierto. Contribuciones bienvenidas via GitHub.*
