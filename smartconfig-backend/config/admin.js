module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'smartconfig-admin-jwt-fallback'),
  },
  apiToken: {
    // Ensure a salt is always provided; override via env for production
    salt: env('API_TOKEN_SALT', 'smartconfig-api-token-salt-fallback'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'smartconfig-transfer-token-salt-fallback'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'smartconfig-encryption-key-fallback'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
