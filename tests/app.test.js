// =====================================================
// Tests automaticos - usan el test runner nativo de Node 20+
// (sin Jest, sin Mocha, sin instalar nada extra).
// =====================================================
// Estos tests se ejecutan automaticamente en el pipeline.
// Si fallan, el codigo NO llega a produccion.
// =====================================================

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

const server = require('../src/index.js');

function hacerPeticion(path) {
  return new Promise((resolve, reject) => {
    const s = server.listen(0, () => {
      const port = s.address().port;
      http.get(`http://localhost:${port}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          s.close();
          resolve({ statusCode: res.statusCode, body: data });
        });
      }).on('error', (err) => {
        s.close();
        reject(err);
      });
    });
  });
}

test('GET / devuelve 200 y un mensaje', async () => {
  const res = await hacerPeticion('/');
  assert.strictEqual(res.statusCode, 200); // bug intencional
  const body = JSON.parse(res.body);
  assert.ok(body.mensaje, 'debe traer un campo mensaje');
  assert.ok(body.version, 'debe traer un campo version');
});

test('GET /health devuelve 200 con status ok', async () => {
  const res = await hacerPeticion('/health');
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.status, 'ok');
});

test('GET /ruta-inexistente devuelve 404', async () => {
  const res = await hacerPeticion('/ruta-que-no-existe');
  assert.strictEqual(res.statusCode, 404);
});
