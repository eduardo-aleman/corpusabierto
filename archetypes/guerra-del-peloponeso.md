---
title: "{{ replace .Name "-" " " | title }}"
order: "{{ index (split .Name "_") 0 }}"
work_title: "Historia de la Guerra del Peloponeso"
book: "Libro I"
author: "Tucídides"
translator: "Juan José Torres Esbarranch"
original_language: "Griego"
greek_text: |
  (Pega aquí el texto original...)
translation: |
  (Pega aquí la traducción...)
alberti: |
  (Pega aquí las notas críticas...)
notesEs: |
  (Pega aquí las notas del traductor...)
downloadTXT: "/{{ .Section }}/formatos/tucidides/lib1/txt/{{ .Name }}.txt"
downloadTEI: "/{{ .Section }}/formatos/tucidides/lib1/xml-tei/{{ .Name }}.xml"
---

#### Fuentes

##### El texto en griego

[Perseus](https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0003.tlg001.perseus-grc2:1.1.1-1.1.3)

##### Ejemplos del aparato crítico de G. B. Alberti  
Extracto a manera de ejemplo del aparato crítico de Alberti.  
G. B. Alberti, _Thucydidis Historiae_ Vol. 1, Libri 1-2, Istituto Poligrafico dello Stato, 1972.  
[Ver libro](https://archive.org/details/thucydidis-historiae-vol.-i-libri-i-ii/)

##### Traducción al español  
[archive.org](https://archive.org/details/tucidides.-historia-de-la-guerra-del-peloponeso-1.-libros-i-ii-g-1990/)

##### Notas del traductor Juan José Torres Esbarranch  
Torres Esbarranch, Juan José, ed. and trans. Tucídides. _Historia de la guerra del Peloponeso_. Libros I-II. Madrid: Gredos, 1990.  
[Ver libro](https://archive.org/details/tucidides.-historia-de-la-guerra-del-peloponeso-1.-libros-i-ii-g-1990/)
