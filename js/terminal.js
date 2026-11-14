// Motor de la terminal en vivo. El contenido vive en ./datos/sesiones.js.
import { menosMovimiento, esperar, observarVisibilidad } from './movimiento.js';

const TECLEO_MIN = 28;           // ms por carácter
const TECLEO_VARIACION = 40;
const PAUSA_TRAS_COMANDO = 320;
const PAUSA_TRAS_LINEA = 260;
const PAUSA_ENTRE_SESIONES = 2600;
const ANCHO_PROGRESO = 30;       // caracteres
const ANCHO_BARRAS = { escritorio: 30, celular: 12 };
const ALTO_GRAFICA = 5;          // filas
const ESPERA_PAUSADA = 200;      // ms entre revisiones mientras está en pausa

export function iniciarTerminal(raiz, sesiones) {
  const pantalla = raiz.querySelector('[data-terminal-pantalla]');
  const titulo = raiz.querySelector('[data-terminal-titulo]');
  const pasosUI = raiz.querySelector('[data-terminal-pasos]');

  let turno = 0;               // cambia cada vez que inicia una sesión; cancela la anterior
  let visible = false;
  let encima = false;

  // ---------- utilidades de pantalla ----------
  const crear = (etiqueta, clase, texto = '') => {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    nodo.textContent = texto;
    return nodo;
  };

  function nuevaLinea() {
    const linea = crear('div');
    pantalla.append(linea);
    // si ya no cabe, se van las líneas de arriba, como en una terminal real
    while (pantalla.scrollHeight > pantalla.clientHeight && pantalla.children.length > 1) {
      pantalla.firstElementChild.remove();
    }
    return linea;
  }

  const pintar = (linea, partes) =>
    linea.replaceChildren(...partes.map(({ texto, estilo }) => crear('span', estilo, texto)));

  const cursor = () => crear('span', 'cursor');

  async function mientrasPausada(miTurno) {
    while ((!visible || encima || document.hidden) && miTurno === turno) {
      await new Promise((r) => setTimeout(r, ESPERA_PAUSADA));
    }
    return miTurno === turno;
  }

  // ---------- un renderizador por tipo de paso ----------
  const renderizadores = {
    async comando(paso, miTurno) {
      const linea = nuevaLinea();
      const texto = document.createTextNode('');
      const marca = cursor();
      linea.append(crear('span', 'prompt', '$ '), texto, marca);
      for (let i = 1; i <= paso.texto.length; i++) {
        if (miTurno !== turno) return;
        texto.nodeValue = paso.texto.slice(0, i);
        await esperar(TECLEO_MIN + Math.random() * TECLEO_VARIACION);
      }
      await esperar(PAUSA_TRAS_COMANDO);
      marca.remove();
    },

    async navegar(paso, miTurno) {
      await renderizadores.comando(paso, miTurno);
      await esperar(400);
      document.getElementById(paso.destino)?.scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth' });
    },

    async texto(paso) {
      pintar(nuevaLinea(), paso.partes);
      await esperar(PAUSA_TRAS_LINEA);
    },

    async espacio() {
      nuevaLinea().textContent = ' ';
      await esperar(200);
    },

    async cargando(paso) {
      const linea = nuevaLinea();
      linea.append(crear('span', 'tenue', paso.texto));
      for (let i = 0; i < 3; i++) {
        await esperar(220);
        linea.append(crear('span', 'tenue', '.'));
      }
      linea.append(crear('span', 'ok', ' ok'));
      await esperar(PAUSA_TRAS_LINEA);
    },

    async progreso(paso, miTurno) {
      const linea = nuevaLinea();
      const etiqueta = paso.etiqueta.padEnd(10);
      for (let lleno = 0; lleno <= ANCHO_PROGRESO; lleno++) {
        if (miTurno !== turno) return;
        const porcentaje = String(Math.round((lleno / ANCHO_PROGRESO) * 100)).padStart(3);
        pintar(linea, [
          { texto: etiqueta },
          { texto: '━'.repeat(lleno), estilo: 'claro' },
          { texto: '━'.repeat(ANCHO_PROGRESO - lleno), estilo: 'tenue' },
          { texto: ` ${porcentaje}%` },
        ]);
        await esperar(22);
      }
      linea.append(crear('span', 'ok', ' ✓'));
    },

    async barras(paso, miTurno) {
      const ancho = window.innerWidth < 760 ? ANCHO_BARRAS.celular : ANCHO_BARRAS.escritorio;
      const maximo = Math.max(...paso.filas.map(([, valor]) => valor));
      const margen = Math.max(...paso.filas.map(([nombre]) => nombre.length));
      const barra = (valor) => {
        const lleno = Math.round((valor / maximo) * ancho);
        return '█'.repeat(lleno) + '░'.repeat(ancho - lleno);
      };
      for (const [nombre, valor] of paso.filas) {
        const linea = nuevaLinea();
        const salto = Math.max(1, Math.round(valor / 18));
        for (let actual = 0; actual <= valor; actual = Math.min(valor, actual + salto)) {
          if (miTurno !== turno) return;
          pintar(linea, [{ texto: `  ${nombre.padEnd(margen)}  ` }, { texto: barra(actual), estilo: 'claro' }, { texto: ` ${actual}` }]);
          await esperar(30);
          if (actual === valor) break;
        }
        await esperar(150);
      }
    },

    async grafica(paso, miTurno) {
      const maximo = Math.max(...paso.valores);
      const filas = Array.from({ length: ALTO_GRAFICA }, nuevaLinea);
      for (let columnas = 1; columnas <= paso.valores.length; columnas++) {
        if (miTurno !== turno) return;
        filas.forEach((linea, r) => {
          const nivel = ALTO_GRAFICA - r;
          const partes = [{ texto: '  ' }];
          paso.valores.slice(0, columnas).forEach((valor) => {
            const alcanza = (valor / maximo) * ALTO_GRAFICA >= nivel - 0.5;
            partes.push(alcanza ? { texto: '▇▇ ', estilo: 'claro' } : { texto: '·· ', estilo: 'tenue' });
          });
          pintar(linea, partes);
        });
        await esperar(90);
      }
      pintar(nuevaLinea(), [{ texto: `  ${paso.leyenda}`, estilo: 'tenue' }]);
      await esperar(300);
    },
  };

  // ---------- indicador de sesiones ----------
  const botones = sesiones.map((sesion, i) => {
    const boton = crear('button');
    boton.type = 'button';
    boton.setAttribute('aria-label', `Sesión ${i + 1}: ${sesion.nombre}`);
    boton.append(crear('i'));
    boton.addEventListener('click', () => correrSesion(i));
    pasosUI.append(boton);
    return boton;
  });

  function marcarAvance(indice, fraccion) {
    botones.forEach((boton, i) => {
      boton.firstElementChild.style.width = i < indice ? '100%' : i > indice ? '0' : `${fraccion * 100}%`;
    });
  }

  // ---------- ciclo principal ----------
  async function correrSesion(indice) {
    const miTurno = ++turno;
    const sesion = sesiones[indice];
    pantalla.replaceChildren();
    titulo.textContent = `omar@ovalenz ~ ${sesion.nombre}`;
    marcarAvance(indice, 0);

    for (const [n, paso] of sesion.pasos.entries()) {
      if (!(await mientrasPausada(miTurno))) return;
      marcarAvance(indice, (n + 1) / sesion.pasos.length);
      await renderizadores[paso.tipo](paso, miTurno);
      if (miTurno !== turno) return;
    }

    nuevaLinea().append(crear('span', 'prompt', '$ '), cursor());
    await esperar(PAUSA_ENTRE_SESIONES);
    if (!(await mientrasPausada(miTurno))) return;
    correrSesion((indice + 1) % sesiones.length);
  }

  raiz.addEventListener('pointerenter', () => { encima = true; });
  raiz.addEventListener('pointerleave', () => { encima = false; });

  let iniciada = false;
  observarVisibilidad(raiz, {
    umbral: 0.4,
    alEntrar: () => {
      visible = true;
      if (!iniciada) { iniciada = true; correrSesion(0); }
    },
    alSalir: () => { visible = false; },
  });
}
