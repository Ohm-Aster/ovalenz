# ovalenz.dev

Sitio personal de Omar Valencia Cruz. HTML, CSS y JavaScript sin dependencias ni paso de compilación; se publica en Cloudflare Pages desde este repositorio.

## Estructura

```
index.html              estructura y contenido (incluye datos estructurados JSON-LD)
404.html                página de error (noindex)
css/
  base.css              fuentes, variables, reset y tipografía
  secciones.css         barra, hero, servicios, casos y contacto
  flujos.css            diagramas de flujo con pulso
  trayectoria.css       línea de tiempo con año fijo
  impresion.css         al imprimir, la página se convierte en CV
js/
  lluvia.js             lluvia con el código de la propia página (solo en el hero)
  flujos.js             activa el pulso de los diagramas al entrar en pantalla
  trayectoria.js        llena la línea según el scroll
  contacto.js           arma el correo al cargar (protección contra bots)
img/                    foto (webp y jpg en dos tamaños)
cv/                     CV en PDF
fonts/                  Archivo y JetBrains Mono (licencia SIL OFL 1.1)
_headers                caché y cabeceras de seguridad para Cloudflare Pages
robots.txt, sitemap.xml indexación
og.png                  imagen para compartir en redes
```

## Editar contenido

- Textos: `index.html`.
- CV: reemplaza `cv/CV_OmarValenciaCruz.pdf` con el mismo nombre.
