/**
 * Demandeintervention.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    panne: {
      type: 'string',
      required: true

    },
    date: {
      type: 'string',
      required: true

    },
    description: {
      type: 'string',
      required: true

    },
    dureearretmachine: {
      type: 'string',

    },
    priorite:{
      type: 'string',
      required: true
    },

    status: {
      type: 'string',

    },
    employee:{
      model:'employee',
    },
    admin:{
      model:'admin',
    },
    
    ordreinterventions: {
        collection: 'ordreintervention',
        via: 'demandeintervention'
      },
   
    equipement :{
      model:'equipement'
    },
  },
  datastores:'sails-mongo',
};

