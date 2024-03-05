/**
 * Intervention.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date_debut: {
      type: 'ref',
      columnType:'datetime',
      required: true
    },
    date_fin: {
      type: 'ref',
      columnType:'datetime',
    },

    etat:{
      type: 'string',
    },
    observation:{
      type: 'string',
    },

    taches: {
      collection: 'tache',
      via: 'intervention'
    },
     ordreintervention:{
       model:'ordreintervention',
     },
     demandepieces: {
      collection: 'demandepiece',
      via: 'intervention'
    },
    
  },
  datastores:'sails-mongo',

};

