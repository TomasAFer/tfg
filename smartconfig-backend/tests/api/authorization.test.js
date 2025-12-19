'use strict';

const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi');
const { generateFullAccessToken, revokeTestToken } = require('../helpers/api-token');
const { getIdsByUID } = require('../helpers/get-id');

describe('API Authorization & Token Validation', () => {
  let strapi;
  let fullAccessToken;
  let readOnlyToken;

  const api = () => request(strapi.server.httpServer);

  beforeAll(async () => {
    strapi = await setupStrapi();
    fullAccessToken = await generateFullAccessToken(strapi);

    // Crear token read-only
    const tokenService = strapi.service('admin::api-token');
    const readOnlyObj = await tokenService.create({
      name: 'Test Read Only Token',
      description: 'Read only token',
      type: 'read-only',
    });
    readOnlyToken = readOnlyObj.accessKey;

    // Crear un accesorio base (usado en métodos GET/PUT/DELETE)
    await api()
      .post('/api/accesorios')
      .set('Authorization', `Bearer ${fullAccessToken}`)
      .send({ data: { accesorio_id: 'auth-base-acc', nombre_corto: 'Base', publishedAt: new Date().toISOString() } })
      .expect(201);
  });

  afterAll(async () => {
    await revokeTestToken(strapi);
    await cleanupStrapi(strapi);
  });

  describe('Request without token', () => {
    test('should deny access to protected endpoints', async () => {
      await api().get('/api/accesorios').expect(res => {
        expect([401,403,500]).toContain(res.status);
      });
    });

    test('should deny POST requests', async () => {
      await api()
        .post('/api/accesorios')
        .send({ data: { accesorio_id: 'no-token', nombre_corto: 'No' } })
        .expect(res => {
          expect([401,403,500]).toContain(res.status);
        });
    });
  });

  describe('Request with invalid token', () => {
    test('malformed token', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(res => {
          expect([401,403]).toContain(res.status);
        });
    });
    test('fake expired token', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', 'Bearer abc.def.ghi')
        .expect(res => {
          expect([401,403]).toContain(res.status);
        });
    });
  });

  describe('Request with full-access token', () => {
    test('should allow GET requests', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .expect(200);
    });

    test('should allow POST requests (create)', async () => {
      await api()
        .post('/api/accesorios')
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .send({ data: { accesorio_id: 'auth-create', nombre_corto: 'Create' } })
        .expect(201);
    });

    test('PUT ok', async () => {
      const uidValue = 'auth-update';
      await api()
        .post('/api/accesorios')
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .send({ data: { accesorio_id: uidValue, nombre_corto: 'Old', publishedAt: new Date().toISOString() } })
        .expect(201);
      const { documentId } = await getIdsByUID(strapi, '/api/accesorios', 'accesorio_id', uidValue, fullAccessToken);
      expect(documentId).toBeTruthy();
      await api()
        .put(`/api/accesorios/${documentId}`)
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .send({ data: { nombre_corto: 'New' } })
        .expect(200);
    });

    test('should allow DELETE requests', async () => {
      const created = await api()
        .post('/api/accesorios')
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .send({ data: { accesorio_id: 'auth-delete', nombre_corto: 'Del' } })
        .expect(201);
      // Obtener documentId para borrado
      const { documentId } = await getIdsByUID(strapi, '/api/accesorios', 'accesorio_id', 'auth-delete', fullAccessToken);
      await api()
        .delete(`/api/accesorios/${documentId}`)
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .expect(204);
    });
  });

  describe('Request with read-only token', () => {
    test('should allow GET requests', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(200);
    });

    test('should deny POST requests', async () => {
      await api()
        .post('/api/accesorios')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .send({ data: { accesorio_id: 'ro-create', nombre_corto: 'RO' } })
        .expect(403);
    });

    test('should deny PUT requests', async () => {
      await api()
        .put('/api/accesorios/1')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .send({ data: { nombre_corto: 'RO' } })
        .expect(403);
    });

    test('should deny DELETE requests', async () => {
      await api()
        .delete('/api/accesorios/1')
        .set('Authorization', `Bearer ${readOnlyToken}`)
        .expect(403);
    });
  });

  describe('Token header variations', () => {
    test('should accept Bearer scheme', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', `Bearer ${fullAccessToken}`)
        .expect(200);
    });

    test('should reject header without Bearer', async () => {
      await api()
        .get('/api/accesorios')
        .set('Authorization', fullAccessToken)
        .expect(res => {
          expect([401,403,500]).toContain(res.status);
        });
    });
  });
});
