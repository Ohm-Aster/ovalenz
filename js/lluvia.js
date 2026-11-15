// Lluvia de código en el hero: cada columna lee de arriba hacia abajo
// el HTML real de esta página. Solo corre mientras el hero está a la vista.
(function () {
  'use strict';

  var TAMANO_FUENTE = 15;          // px
  var ALTO_FILA = 18;              // px entre caracteres
  var VELOCIDAD_MIN = 8;           // filas por segundo
  var VELOCIDAD_VARIACION = 16;
  var PASO_MAXIMO = 0.05;          // s; evita saltos al volver a la pestaña
  var COLOR_FONDO = '#070B10';
  var DESVANECIDO = 'rgba(7, 11, 16, 0.07)';
  var COLOR_ESTELA = 'rgba(78, 112, 146, 0.85)';
  var COLOR_CABEZA = '#FFB04A';

  var lienzo = document.querySelector('.lluvia');
  if (!lienzo) return;

  var ctx = lienzo.getContext('2d');
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fuente = document.documentElement.outerHTML.replace(/\s+/g, ' ');
  var ancho = 0, alto = 0, anchoColumna = 10, columnas = [];
  var activa = false, visible = false, ultimo = 0, idCuadro = 0;

  function nuevaColumna(indice, alInicio) {
    return {
      x: indice * anchoColumna,
      fila: alInicio ? -Math.floor(Math.random() * alto / ALTO_FILA) : -Math.floor(Math.random() * 12),
      velocidad: VELOCIDAD_MIN + Math.random() * VELOCIDAD_VARIACION,
      acumulado: 0,
      posicion: Math.floor(Math.random() * fuente.length),
      anterior: null
    };
  }

  function dibujarEstatica() {
    ctx.fillStyle = COLOR_ESTELA;
    columnas.forEach(function (columna, i) {
      var inicio = (i * 97) % fuente.length;
      for (var fila = 0; fila * ALTO_FILA < alto; fila++) {
        ctx.fillText(fuente[(inicio + fila) % fuente.length], columna.x, fila * ALTO_FILA);
      }
    });
  }

  function dimensionar() {
    var escala = Math.min(2, window.devicePixelRatio || 1);
    ancho = lienzo.clientWidth;
    alto = lienzo.clientHeight;
    lienzo.width = ancho * escala;
    lienzo.height = alto * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    ctx.font = '400 ' + TAMANO_FUENTE + "px 'JetBrains Mono', monospace";
    ctx.textBaseline = 'top';
    anchoColumna = Math.ceil(ctx.measureText('M').width) + 2;
    columnas = [];
    for (var i = 0; i < Math.ceil(ancho / anchoColumna); i++) columnas.push(nuevaColumna(i, true));
    ctx.fillStyle = COLOR_FONDO;
    ctx.fillRect(0, 0, ancho, alto);
    if (menosMovimiento) dibujarEstatica();
  }

  function avanzar(columna, indice) {
    // el carácter que era cabeza pasa a la estela
    if (columna.anterior && columna.anterior.caracter !== ' ') {
      ctx.fillStyle = COLOR_FONDO;
      ctx.fillRect(columna.x, columna.anterior.y, anchoColumna, ALTO_FILA);
      ctx.fillStyle = COLOR_ESTELA;
      ctx.fillText(columna.anterior.caracter, columna.x, columna.anterior.y);
    }
    columna.fila++;
    var y = columna.fila * ALTO_FILA;
    var caracter = fuente[columna.posicion++ % fuente.length];
    if (y >= 0 && caracter !== ' ') {
      ctx.fillStyle = COLOR_CABEZA;
      ctx.fillText(caracter, columna.x, y);
    }
    columna.anterior = { caracter: caracter, y: y };
    if (y > alto + Math.random() * alto * 0.6) columnas[indice] = nuevaColumna(indice, false);
  }

  function cuadro(ahora) {
    if (!activa) return;
    var delta = Math.min(PASO_MAXIMO, (ahora - ultimo) / 1000);
    ultimo = ahora;
    ctx.fillStyle = DESVANECIDO;
    ctx.fillRect(0, 0, ancho, alto);
    columnas.forEach(function (columna, i) {
      columna.acumulado += columna.velocidad * delta;
      while (columna.acumulado >= 1 && columnas[i] === columna) {
        columna.acumulado -= 1;
        avanzar(columna, i);
      }
    });
    idCuadro = requestAnimationFrame(cuadro);
  }

  function arrancar() {
    if (activa || menosMovimiento || document.hidden || !visible) return;
    activa = true;
    ultimo = performance.now();
    idCuadro = requestAnimationFrame(cuadro);
  }

  function detener() {
    activa = false;
    cancelAnimationFrame(idCuadro);
  }

  function iniciar() {
    dimensionar();
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      if (visible) arrancar(); else detener();
    }).observe(lienzo);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) detener(); else arrancar();
    });
    var temporizador;
    window.addEventListener('resize', function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(dimensionar, 150);
    });
  }

  // la fuente monoespaciada debe estar lista para medir las columnas
  if (document.fonts && document.fonts.load) {
    document.fonts.load("400 15px 'JetBrains Mono'").then(iniciar, iniciar);
  } else {
    iniciar();
  }
})();
