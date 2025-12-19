'use strict';

import test, { describe } from 'node:test';

const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi');
const { generateFullAccessToken, revokeTestToken } = require('../helpers/api-token');
const { getIdsByUID } = require('../helpers/get-id');

describe('Robots API (full-access token)', () => {
  let strapi;
  let token;
  let familiaId;
  const api = () => request(strapi.server.httpServer);

  beforeAll(async () => {
    strapi = await setupStrapi();
    token = await generateFullAccessToken(strapi);

    // Crear familia base
    const fam = await api()
      .post('/api/familias')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          familia_id: 'fam-test-robots',
          nombre: 'Familia Test',
          slug: 'familia-test',
          publishedAt: new Date().toISOString(),
        },
      })
      .expect(201);
    familiaId = fam.body.data.id;
  });

  afterAll(async () => {
    await revokeTestToken(strapi);
    await cleanupStrapi(strapi);
  });

  test('CREATE robot', async () => {
    const res = await api()
      .post('/api/robots')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          robot_id: 'robot-test-001',
          modelo: 'RT-100',
          ejes: 6,
          colaborativo: false,
          familia: familiaId,
          publishedAt: new Date().toISOString(),
        },
      })
      .expect(201);
    expect(res.body.data.robot_id).toBe('robot-test-001');
  });

  test('LIST robots paginated', async () => {
    const res = await api()
      .get('/api/robots?pagination[pageSize]=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('FILTER robots by colaborativo', async () => {
    const res = await api()
      .get('/api/robots?filters[colaborativo][$eq]=false')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POPULATE familia', async () => {
    const res = await api()
      .get('/api/robots?populate=familia')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('UPDATE robot', async () => {
    const robotUID = 'robot-update';
    await api()
      .post('/api/robots')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { robot_id: robotUID, modelo: 'RU-1', ejes: 4, familia: familiaId, publishedAt: new Date().toISOString() } })
      .expect(201);
    const { documentId } = await getIdsByUID(strapi, '/api/robots', 'robot_id', robotUID, token);
    expect(documentId).toBeTruthy();
    const updated = await api()
      .put(`/api/robots/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { ejes: 5 } })
      .expect(200);
    expect(updated.body.data.ejes).toBe(5);
  });
});
