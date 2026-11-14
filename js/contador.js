// Cifras que cuentan desde cero la primera vez que aparecen en pantalla.
import { menosMovimiento, observarVisibilidad } from './movimiento.js';

const DURACION = 1100; // ms

const suavizar = (t) => 1 - Math.pow(1 - t, 3);

function contar(elemento) {
  const final = Number(elemento.dataset.contar);
  const inicio = performance.now();
  function paso(ahora) {
    const progreso = Math.min(1, (ahora - inicio) / DURACION);
    elemento.textContent = Math.round(final * suavizar(progreso));
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

export function iniciarContadores(elementos) {
  if (menosMovimiento) return; // las cifras ya vienen escritas en el HTML
  for (const elemento of elementos) {
    elemento.textContent = '0';
    const observador = observarVisibilidad(elemento, {
      umbral: 0.6,
      alEntrar: () => { observador.disconnect(); contar(elemento); },
    });
  }
}
