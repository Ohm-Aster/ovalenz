# ovalenz.dev

Sitio personal de Omar Valencia Cruz. HTML, CSS y JavaScript sin dependencias ni paso de compilación; se publica en Cloudflare Pages desde este repositorio.

## Estructura

```
index.html              estructura y contenido
404.html                página de error
css/
  base.css              fuentes, variables, reset y tipografía
  secciones.css         barra, hero y secciones
  terminal.css          terminal en vivo
js/
  main.js               punto de entrada
  movimiento.js         preferencia de movimiento y visibilidad
  lluvia.js             lluvia con el código de la propia página (solo en el hero)
  terminal.js           motor de la terminal
  contador.js           cifras que cuentan desde cero
  navegacion.js         sección activa en la barra
  datos/sesiones.js     lo que escribe la terminal
fonts/                  Archivo y JetBrains Mono (licencia SIL OFL 1.1)
_headers                caché y cabeceras de seguridad para Cloudflare Pages
```

## Editar contenido

- Textos de las secciones: `index.html`.
- Lo que escribe la terminal: `js/datos/sesiones.js`.

## Probar en local

Los módulos de JavaScript necesitan servirse por HTTP:

```
python -m http.server 8000
```

y abrir http://localhost:8000.

## Publicar

Cada `git push` a `main` se publica solo en Cloudflare Pages (sin comando de compilación, directorio de salida `/`).
