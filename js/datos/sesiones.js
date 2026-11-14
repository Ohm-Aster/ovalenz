// Contenido de la terminal. Para cambiar lo que "escribe", edita solo este archivo.
//
// Tipos de paso:
//   comando   -> se teclea después del prompt ($)
//   texto     -> línea de salida; `partes` es una lista de segmentos con estilo opcional
//   espacio   -> línea en blanco
//   progreso  -> barra que se llena de 0 a 100 %
//   barras    -> gráfica horizontal con valores reales
//   grafica   -> columnas que crecen una por una
//   cargando  -> texto seguido de "... ok"
//   navegar   -> se teclea un comando y la página baja a una sección

const ok = (texto) => ({ texto, estilo: 'ok' });
const claro = (texto) => ({ texto, estilo: 'claro' });
const normal = (texto) => ({ texto });

export const SESIONES = [
  {
    nombre: 'agente',
    pasos: [
      { tipo: 'comando', texto: 'python agente_documentos.py --modo revision' },
      { tipo: 'cargando', texto: 'conectando con Azure AI Foundry' },
      { tipo: 'progreso', etiqueta: 'leer' },
      { tipo: 'progreso', etiqueta: 'comparar' },
      { tipo: 'progreso', etiqueta: 'redactar' },
      { tipo: 'texto', partes: [ok('✓ '), normal('borradores listos. '), claro('Ninguno se publica sin aprobación humana.')] },
    ],
  },
  {
    nombre: 'datos',
    pasos: [
      { tipo: 'comando', texto: 'python reporte_semanal.py' },
      { tipo: 'progreso', etiqueta: 'extraer' },
      { tipo: 'progreso', etiqueta: 'limpiar' },
      { tipo: 'progreso', etiqueta: 'publicar' },
      { tipo: 'grafica', valores: [3, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15], leyenda: 'casos por semana (datos de ejemplo)' },
      { tipo: 'texto', partes: [ok('✓ '), normal('reporte enviado. Nadie tuvo que copiar y pegar.')] },
    ],
  },
  {
    nombre: 'maker',
    pasos: [
      { tipo: 'comando', texto: 'arduino-cli upload -p COM3 --fqbn arduino:avr:uno radar' },
      { tipo: 'progreso', etiqueta: 'subiendo' },
      { tipo: 'texto', partes: [ok('✓ '), normal('sensor ultrasónico y servo respondiendo')] },
      { tipo: 'espacio' },
      { tipo: 'comando', texto: 'imprimir soporte_sensor.gcode' },
      { tipo: 'cargando', texto: 'cama 60°C, boquilla 210°C' },
      { tipo: 'progreso', etiqueta: 'capas' },
      { tipo: 'texto', partes: [ok('✓ '), normal('pieza lista para montar')] },
    ],
  },
  {
    nombre: 'clase',
    pasos: [
      { tipo: 'comando', texto: 'omar enseña --nivel "desde cero"' },
      { tipo: 'texto', partes: [normal('  1. diagrama de clases')] },
      { tipo: 'texto', partes: [normal('  2. código')] },
      { tipo: 'texto', partes: [normal('  3. compilar y probar')] },
      { tipo: 'texto', partes: [ok('✓ '), normal('regla del salón: todo funciona a la primera')] },
      { tipo: 'espacio' },
      { tipo: 'comando', texto: 'omar alumnos --por-curso' },
      {
        tipo: 'barras',
        filas: [['IA agéntica (Intel)', 98], ['Java Fundamentals', 146], ['OCI Foundations', 101]],
      },
      { tipo: 'espacio' },
      { tipo: 'navegar', texto: 'cd contacto', destino: 'contacto' },
    ],
  },
];
