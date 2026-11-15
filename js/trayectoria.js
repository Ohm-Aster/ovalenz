// Trayectoria: llena la línea según el scroll, marca las etapas
// alcanzadas y cambia el año fijo cuando cambia la etapa.
(function () {
  'use strict';

  var linea = document.querySelector('[data-linea]');
  var anio = document.querySelector('[data-anio]');
  if (!linea || !anio) return;

  var etapas = Array.prototype.slice.call(linea.querySelectorAll('li'));
  var PUNTO_DE_LECTURA = 0.55; // fracción de la ventana donde "se lee" la etapa
  var DURACION_CAMBIO = 450;   // ms, igual que la transición en CSS
  var pendiente = false;

  function cambiarAnio(nuevo) {
    if (anio.textContent === nuevo || anio.dataset.cambiando) return;
    anio.dataset.cambiando = '1';
    anio.classList.add('saliendo');
    setTimeout(function () {
      anio.textContent = nuevo;
      anio.classList.remove('saliendo');
      anio.classList.add('entrando');
      anio.getBoundingClientRect(); // fuerza el reflujo para animar la entrada
      anio.classList.remove('entrando');
      delete anio.dataset.cambiando;
      solicitar(); // por si la etapa cambió durante la animación
    }, DURACION_CAMBIO);
  }

  function actualizar() {
    pendiente = false;
    var lectura = window.innerHeight * PUNTO_DE_LECTURA;
    var caja = linea.getBoundingClientRect();
    var avance = Math.min(1, Math.max(0, (lectura - caja.top) / caja.height));
    linea.style.setProperty('--avance', avance.toFixed(4));

    var actual = etapas[0];
    etapas.forEach(function (etapa) {
      var alcanzada = etapa.getBoundingClientRect().top < lectura;
      etapa.classList.toggle('alcanzado', alcanzada);
      if (alcanzada) actual = etapa;
    });
    cambiarAnio(actual.dataset.anioEtapa);
  }

  function solicitar() {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizar);
    }
  }

  window.addEventListener('scroll', solicitar, { passive: true });
  window.addEventListener('resize', solicitar);
  actualizar();
})();
