'use strict';

const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi');
const { generateFullAccessToken, revokeTestToken } = require('../helpers/api-token');

describe('Relationships API (full-access token)', () => {
  let strapi;
  let token;
  let robotId;
  let accesorioId;
  let accesorio2Id;
  let controladoraId;
  const api = () => request(strapi.server.httpServer);

  beforeAll(async () => {
    strapi = await setupStrapi();
    token = await generateFullAccessToken(strapi);

    // Base robot
    const robotRes = await api()
      .post('/api/robots')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { robot_id: 'robot-rel-1', modelo: 'REL-1', ejes: 6 } })
      .expect(201);
    robotId = robotRes.body.data.id;

    // Accesorios
    const acc1 = await api()
      .post('/api/accesorios')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { accesorio_id: 'acc-rel-1', nombre_corto: 'Acc 1' } })
      .expect(201);
    accesorioId = acc1.body.data.id;

    const acc2 = await api()
      .post('/api/accesorios')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { accesorio_id: 'acc-rel-2', nombre_corto: 'Acc 2' } })
      .expect(201);
    accesorio2Id = acc2.body.data.id;

    // Controladora
    const ctrl = await api()
      .post('/api/controladoras')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: { controladora_id: 'ctrl-rel-1', nombre: 'Ctrl 1' } })
      .expect(201);
    controladoraId = ctrl.body.data.id;
  });

  afterAll(async () => {
    await revokeTestToken(strapi);
    await cleanupStrapi(strapi);
  });

  test('LINK robot-accesorio', async () => {
    const res = await api()
      .post('/api/robot-accesorios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          RobotAccesorio_id: 'ra-link-1',
          robot_id: robotId,
          accesorio_id: accesorioId,
          obligatorio: true,
          min_cantidad: 1,
          max_cantidad: 3,
        },
      })
      .expect(201);
    expect(res.body.data.obligatorio).toBe(true);
  });

  test('LINK robot-controladora', async () => {
    const res = await api()
      .post('/api/robot-controladoras')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          robot_id: robotId,
          controladora_id: controladoraId,
        },
      })
      .expect(201);
    expect(res.body.data.id).toBeDefined();
  });

  test('CREATE accesorio exclusion', async () => {
    const res = await api()
      .post('/api/accesorio-exclusions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        data: {
          AccesorioExclusion_id: 'exc-1',
          accesorio_a_id: accesorioId,
          accesorio_b_id: accesorio2Id,
          motivo: 'Incompatibles por tamaño',
        },
      })
      .expect(201);
    expect(res.body.data.motivo).toContain('Incompatibles');
  });

  test('QUERY robot-accesorios populate', async () => {
    const res = await api()
      .get('/api/robot-accesorios?populate=*')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('FILTER robot-accesorios by robot id', async () => {
    const res = await api()
      .get(`/api/robot-accesorios?filters[robot_id][id][$eq]=${robotId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
