'use strict';

const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi');
const { generateFullAccessToken, revokeTestToken } = require('../helpers/api-token');
const { getIdsByUID } = require('../helpers/get-id');

describe('Accesorios API (full-access token)', () => {
  let strapi;
  let token;
  let entryId;
  let documentId;
  const api = () => request(strapi.server.httpServer);

  beforeAll(async () => {
    strapi = await setupStrapi();
    token = await generateFullAccessToken(strapi);
  });

  afterAll(async () => {
    await revokeTestToken(strapi);
    await cleanupStrapi(strapi);
  });

  test('CREATE accesorio', async () => {
    const uidValue = 'acc-test-001';
    await api()
      .post('/api/accesorios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          accesorio_id: uidValue,
          nombre_corto: 'Acc Test',
          codigo: 'CODE-001',
          publishedAt: new Date().toISOString(),
        },
      })
      .expect(201);
    const ids = await getIdsByUID(strapi, '/api/accesorios', 'accesorio_id', uidValue, token);
    entryId = ids.entryId;
    documentId = ids.documentId;
    expect(documentId).toBeTruthy();
  });

  test('READ list accesorios', async () => {
    const res = await api()
      .get('/api/accesorios')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('READ single accesorio', async () => {
    const res = await api()
      .get(`/api/accesorios/${documentId}?publicationState=preview`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.documentId || res.body.data.id).toBe(documentId);
  });

  test('UPDATE accesorio', async () => {
    const res = await api()
      .put(`/api/accesorios/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { nombre_corto: 'Acc Updated' } })
      .expect(200);
    expect(res.body.data.nombre_corto).toBe('Acc Updated');
  });

  test('DELETE accesorio', async () => {
    await api()
      .delete(`/api/accesorios/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await api()
      .get(`/api/accesorios/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
