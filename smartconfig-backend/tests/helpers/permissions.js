'use strict';

const CONTENT_TYPES = [
  'api::accesorio.accesorio',
  'api::robot.robot',
  'api::familia.familia',
  'api::controladora.controladora',
  'api::industria.industria',
  'api::categoria-accesorio.categoria-accesorio',
  'api::robot-accesorio.robot-accesorio',
  'api::robot-controladora.robot-controladora',
  'api::robot-industria.robot-industria',
  'api::accesorio-exclusion.accesorio-exclusion',
  'api::accesorio-controladora-requerida.accesorio-controladora-requerida',
  'api::solicitud-contacto.solicitud-contacto',
];

const ACTIONS = ['find', 'findOne', 'create', 'update', 'delete'];

async function grantPublicPermissions(strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!role) return;

  // Evitar duplicados: recoger acciones existentes
  const existing = await strapi.db.query('plugin::users-permissions.permission').findMany({
    where: { role: role.id },
    select: ['action'],
  });
  const existingSet = new Set(existing.map(p => p.action));

  const toCreate = [];
  for (const ct of CONTENT_TYPES) {
    for (const act of ACTIONS) {
      const actionName = `${ct}.${act}`;
      if (!existingSet.has(actionName)) {
        toCreate.push({ action: actionName, role: role.id });
      }
    }
  }
  if (toCreate.length) {
    await strapi.db.query('plugin::users-permissions.permission').createMany({ data: toCreate });
  }
}

module.exports = { grantPublicPermissions };
