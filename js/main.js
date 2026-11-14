// Punto de entrada: conecta cada módulo con su parte de la página.
import { iniciarLluvia } from './lluvia.js';
import { iniciarTerminal } from './terminal.js';
import { iniciarContadores } from './contador.js';
import { marcarSeccionActual } from './navegacion.js';
import { SESIONES } from './datos/sesiones.js';

const lienzo = document.querySelector('.lluvia');
const terminal = document.querySelector('[data-terminal]');

// La lluvia necesita la fuente monoespaciada cargada para medir columnas.
document.fonts.load("400 15px 'JetBrains Mono'").finally(() => {
  if (lienzo) iniciarLluvia(lienzo, document.documentElement.outerHTML);
});

if (terminal) iniciarTerminal(terminal, SESIONES);
iniciarContadores(document.querySelectorAll('[data-contar]'));
marcarSeccionActual([...document.querySelectorAll('.barra nav a')]);
