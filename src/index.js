// =====================================================
// Aplicación demo para clase DevOps - Utadeo 2026
// =====================================================
// Esta es una API mínima en Node.js (sin frameworks).
// El foco NO es el código — es el PIPELINE que lo
// lleva a producción automáticamente.
// =====================================================

const http = require('http');

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || 'dev';
const ENV = process.env.APP_ENV || 'local';
const SALUDO = process.env.SALUDO || 'Hola Utadeo - clase DevOps 2026';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // Endpoint principal
  if (req.url === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      mensaje: SALUDO,
      version: VERSION,
      entorno: ENV,
      hora: new Date().toISOString()
    }));
    return;
  }

  // Health check - lo usa Kubernetes / load balancers para
  // saber si la app está viva. CONCEPTO CLAVE de DevOps.
  if (req.url === '/health') {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok', version: VERSION }));
    return;
  }

  // Endpoint que falla a propósito — útil para demos de observabilidad.
  if (req.url === '/error') {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Esto es un error de prueba' }));
    return;
  }

  if (req.url === '/aboutme') {
  res.statusCode = 200;
  res.end(JSON.stringify({
    nombre: 'TU NOMBRE AQUÍ',
    carrera: 'Arquitectura de Software',
    universidad: 'Utadeo',
    año: 2026
  }));
  return;
}

  // =====================================================
  // ACTIVIDAD 1: agrega tu endpoint /aboutme aquí arriba
  // (antes de este comentario y del 404 de abajo)
  // =====================================================

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'No encontrado' }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT} - version ${VERSION} - entorno ${ENV}`);
  });
}

module.exports = server;
