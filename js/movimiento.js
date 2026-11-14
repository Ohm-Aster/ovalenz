// Preferencia de movimiento del visitante, resuelta en un solo lugar.
export const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pausa que se vuelve inmediata cuando el visitante pide menos movimiento.
export const esperar = (ms) =>
  new Promise((resolver) => setTimeout(resolver, menosMovimiento ? 0 : ms));

// Ejecuta `alEntrar` cada vez que el elemento entra a pantalla y `alSalir` cuando sale.
export function observarVisibilidad(elemento, { alEntrar, alSalir, umbral = 0 } = {}) {
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) alEntrar?.(entrada.target);
      else alSalir?.(entrada.target);
    }
  }, { threshold: umbral });
  observador.observe(elemento);
  return observador;
}
