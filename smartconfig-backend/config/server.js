module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    // Fallback to deterministic placeholder keys if APP_KEYS is not set.
    // For production override via environment: APP_KEYS="keyA,keyB,keyC"
    keys: env.array('APP_KEYS', [
      'smartconfig-backend-key-1',
      'smartconfig-backend-key-2',
      'smartconfig-backend-key-3'
    ]),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

