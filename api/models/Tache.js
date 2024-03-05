/**
 * Tache.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    date:{
      type: 'string',
    },
    description:{
      type: 'string' ,
    
    },
    nom_piece:{
      type: 'string',
    },
    
     quantite:{
      type: 'string',
     },
    intervention:{
      model:'intervention'
    },
  },
  datastores:'sails-mongo',
};

