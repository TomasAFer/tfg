'use strict';

/**
 * solicitud-contacto router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/solicitud-contacto',
      handler: 'solicitud-contacto.find',
    },
    {
      method: 'GET',
      path: '/solicitud-contacto/:id',
      handler: 'solicitud-contacto.findOne',
    },
    {
      method: 'POST',
      path: '/solicitud-contacto',
      handler: 'solicitud-contacto.create',
    },
    {
      method: 'PUT',
      path: '/solicitud-contacto/:id',
      handler: 'solicitud-contacto.update',
    },
    {
      method: 'DELETE',
      path: '/solicitud-contacto/:id',
      handler: 'solicitud-contacto.delete',
    },
  ],
};
