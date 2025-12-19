'use strict';
const request = require('supertest');

// Devuelve { entryId, documentId } para un UID
async function getIdsByUID(strapi, apiPath, uidField, uidValue, token) {
  const res = await request(strapi.server.httpServer)
    .get(`${apiPath}?filters[${uidField}][$eq]=${encodeURIComponent(uidValue)}&publicationState=preview`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  const item = res.body.data && res.body.data.find(d => d[uidField] === uidValue);
  if (!item) return { entryId: null, documentId: null };

  // Strapi v5 expone documentId para rutas /:id
  const documentId = item.documentId || item.id; // fallback
  const entryId = item.id;
  return { entryId, documentId };
}

module.exports = { getIdsByUID };
