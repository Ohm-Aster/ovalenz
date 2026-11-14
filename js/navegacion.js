// Marca en la barra la sección que se está viendo.
export function marcarSeccionActual(enlaces) {
  const porId = new Map(enlaces.map((enlace) => [enlace.hash.slice(1), enlace]));
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      enlaces.forEach((enlace) => enlace.removeAttribute('aria-current'));
      porId.get(entrada.target.id)?.setAttribute('aria-current', 'true');
    }
  }, { rootMargin: '-45% 0px -45% 0px' });

  for (const id of porId.keys()) {
    const seccion = document.getElementById(id);
    if (seccion) observador.observe(seccion);
  }
}
