'use strict';

/**
 * solicitud-contacto controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::solicitud-contacto.solicitud-contacto', ({ strapi }) => ({
  async create(ctx) {
    try {
      const bodyData = ctx.request.body?.data || {};
      if (!bodyData.nombre || !bodyData.empresa || !bodyData.email) {
        return ctx.badRequest('Faltan campos obligatorios: nombre, empresa, email');
      }

      const solicitud = await strapi.documents('api::solicitud-contacto.solicitud-contacto').create({
        data: {
          nombre: bodyData.nombre,
          empresa: bodyData.empresa,
          email: bodyData.email,
          telefono: bodyData.telefono ?? null,
          comentario: bodyData.comentario ?? null,
          configuracion_robots: bodyData.configuracion_robots ?? [],
          precio_total: bodyData.precio_total ?? null,
          estado: bodyData.estado ?? 'pendiente',
        },
      });

      return {
        success: true,
        message: 'Su solicitud ha sido enviada correctamente. Un comercial se pondrá en contacto con usted.',
        data: solicitud,
      };
    } catch (error) {
      strapi.log.error('Error creando solicitud de contacto:', error);
      return ctx.badRequest('Error al procesar la solicitud');
    }
  },
}));
