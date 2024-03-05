/**
 * Etatequipement.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nometat: {
      type: 'string',
      required: true
    },
    dateetat: {
      type: 'string',
    

    },
    status: {
      type: 'string',


    }, 
 
  equipement:{
    model: 'equipement',
   


},
  },
  datastores:'sails-mongo',
};

