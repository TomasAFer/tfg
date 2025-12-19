'use strict';
const path = require('path');
const { createStrapi } = require('@strapi/strapi');
const { grantPublicPermissions } = require('./permissions');

let instanceCounter = 0;

async function setupStrapi() {
  instanceCounter += 1;
  process.env.DATABASE_FILENAME = `.tmp/test-${Date.now()}-${instanceCounter}.db`;
  const strapi = await createStrapi({
    appDir: path.join(__dirname, '..', '..'),
  }).load();
  await strapi.server.listen(); // levanta httpServer interno
  await grantPublicPermissions(strapi);
  return strapi;
}

async function cleanupStrapi(strapi) {
  if (strapi) {
    await strapi.destroy();
  }
}

module.exports = { setupStrapi, cleanupStrapi };
