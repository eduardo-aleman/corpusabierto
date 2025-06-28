/**
 * Script para cargar iframes de visualizaciones de forma perezosa (lazy loading).
 * Busca todos los iframes con el atributo 'data-src' y los carga solo
 * cuando entran en el área visible de la pantalla.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Seleccionamos todos los iframes que tienen el atributo 'data-src'
  const lazyIframes = document.querySelectorAll('iframe[data-src]');

  // Si no hay iframes para cargar, no hacemos nada.
  if (!lazyIframes.length) {
    return;
  }

  // Creamos un "observador" que vigilará cuándo un elemento entra en la pantalla.
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Si el iframe es visible...
      if (entry.isIntersecting) {
        const iframe = entry.target;
        
        // Copiamos la URL del atributo 'data-src' al atributo 'src'.
        // Esto hace que el iframe comience a cargar su contenido.
        iframe.src = iframe.dataset.src;
        
        // Dejamos de observar este iframe, ya que el trabajo está hecho.
        observer.unobserve(iframe);
      }
    });
  });

  // Le decimos al observador que vigile cada uno de nuestros iframes.
  lazyIframes.forEach(iframe => {
    observer.observe(iframe);
  });
});