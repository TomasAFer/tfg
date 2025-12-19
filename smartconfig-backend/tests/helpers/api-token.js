'use strict';

let cachedToken = null;

/**
 * Generate a full-access API token for testing
 * @param {Object} strapi - Strapi instance
 * @returns {Promise<string>} API token
 */
async function generateFullAccessToken(strapi) {
  if (cachedToken) return cachedToken;
  const service = strapi.service('admin::api-token');
  const token = await service.create({
    name: 'Test Full Access Token',
    description: 'Test token',
    type: 'full-access',
  });
  cachedToken = token.accessKey;
  return cachedToken;
}

/**
 * Cleanup: revoke the test token
 * @param {Object} strapi - Strapi instance
 */
async function revokeTestToken(strapi) {
  if (!cachedToken) return;
  const service = strapi.service('admin::api-token');
  const list = await service.list();
  const found = list.find((t) => t.name === 'Test Full Access Token');
  if (found) await service.revoke(found.id);
  cachedToken = null;
}

module.exports = { generateFullAccessToken, revokeTestToken };
