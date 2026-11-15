// Activa la animación de cada diagrama solo mientras está en pantalla.
(function () {
  'use strict';

  var flujos = document.querySelectorAll('.flujo');

  // cada etapa necesita su posición para escalonar el pulso
  flujos.forEach(function (flujo) {
    flujo.querySelectorAll('li').forEach(function (etapa, indice) {
      etapa.style.setProperty('--i', indice);
    });
  });

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      entrada.target.classList.toggle('activo', entrada.isIntersecting);
    });
  }, { threshold: 0.35 });

  flujos.forEach(function (flujo) { observador.observe(flujo); });
})();
