// Lluvia de código: cada columna "lee" de arriba hacia abajo el HTML real de la página.
import { menosMovimiento, observarVisibilidad } from './movimiento.js';

const TAMANO_FUENTE = 15;          // px
const ALTO_FILA = 18;              // px entre caracteres de una columna
const VELOCIDAD_MIN = 8;           // filas por segundo
const VELOCIDAD_VARIACION = 16;
const DESVANECIDO = 'rgba(7, 11, 16, 0.07)';   // qué tan rápido se borra la estela
const COLOR_FONDO = '#070B10';
const COLOR_ESTELA = 'rgba(78, 112, 146, 0.85)';
const COLOR_CABEZA = '#FFB04A';
const PASO_MAXIMO = 0.05;          // s; evita saltos al volver a la pestaña

export function iniciarLluvia(canvas, textoFuente) {
  const ctx = canvas.getContext('2d');
  const fuente = textoFuente.replace(/\s+/g, ' ').trim();
  let ancho = 0, alto = 0, anchoColumna = 10, columnas = [];
  let activa = false, ultimoCuadro = 0, idCuadro = 0;

  const nuevaColumna = (indice, alInicio) => ({
    x: indice * anchoColumna,
    fila: alInicio ? -Math.floor(Math.random() * alto / ALTO_FILA) : -Math.floor(Math.random() * 12),
    velocidad: VELOCIDAD_MIN + Math.random() * VELOCIDAD_VARIACION,
    acumulado: 0,
    posicion: Math.floor(Math.random() * fuente.length),
    anterior: null,
  });

  function dimensionar() {
    const escala = Math.min(2, window.devicePixelRatio || 1);
    ancho = canvas.clientWidth;
    alto = canvas.clientHeight;
    canvas.width = ancho * escala;
    canvas.height = alto * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    ctx.font = `400 ${TAMANO_FUENTE}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'top';
    anchoColumna = Math.ceil(ctx.measureText('M').width) + 2;
    columnas = Array.from({ length: Math.ceil(ancho / anchoColumna) }, (_, i) => nuevaColumna(i, true));
    ctx.fillStyle = COLOR_FONDO;
    ctx.fillRect(0, 0, ancho, alto);
    if (menosMovimiento) dibujarEstatica();
  }

  // Versión sin animación: columnas de código quietas.
  function dibujarEstatica() {
    ctx.fillStyle = COLOR_ESTELA;
    columnas.forEach((columna, i) => {
      const inicio = (i * 97) % fuente.length;
      for (let fila = 0; fila * ALTO_FILA < alto; fila++) {
        ctx.fillText(fuente[(inicio + fila) % fuente.length], columna.x, fila * ALTO_FILA);
      }
    });
  }

  function avanzar(columna, indice) {
    // el carácter que era cabeza pasa a formar parte de la estela
    if (columna.anterior && columna.anterior.caracter !== ' ') {
      ctx.fillStyle = COLOR_FONDO;
      ctx.fillRect(columna.x, columna.anterior.y, anchoColumna, ALTO_FILA);
      ctx.fillStyle = COLOR_ESTELA;
      ctx.fillText(columna.anterior.caracter, columna.x, columna.anterior.y);
    }
    columna.fila++;
    const y = columna.fila * ALTO_FILA;
    const caracter = fuente[columna.posicion++ % fuente.length];
    if (y >= 0 && caracter !== ' ') {
      ctx.fillStyle = COLOR_CABEZA;
      ctx.fillText(caracter, columna.x, y);
    }
    columna.anterior = { caracter, y };
    if (y > alto + Math.random() * alto * 0.6) columnas[indice] = nuevaColumna(indice, false);
  }

  function cuadro(ahora) {
    if (!activa) return;
    const delta = Math.min(PASO_MAXIMO, (ahora - ultimoCuadro) / 1000);
    ultimoCuadro = ahora;
    ctx.fillStyle = DESVANECIDO;
    ctx.fillRect(0, 0, ancho, alto);
    columnas.forEach((columna, i) => {
      columna.acumulado += columna.velocidad * delta;
      while (columna.acumulado >= 1 && columnas[i] === columna) {
        columna.acumulado -= 1;
        avanzar(columna, i);
      }
    });
    idCuadro = requestAnimationFrame(cuadro);
  }

  function arrancar() {
    if (activa || menosMovimiento || document.hidden) return;
    activa = true;
    ultimoCuadro = performance.now();
    idCuadro = requestAnimationFrame(cuadro);
  }

  function detener() {
    activa = false;
    cancelAnimationFrame(idCuadro);
  }

  dimensionar();
  let temporizador;
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(dimensionar, 150);
  });

  // solo consume CPU cuando el hero está a la vista y la pestaña está activa
  let visible = false;
  observarVisibilidad(canvas, {
    alEntrar: () => { visible = true; arrancar(); },
    alSalir: () => { visible = false; detener(); },
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) detener();
    else if (visible) arrancar();
  });
}
