/**
 * Equipement.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    libelle: {
      type: 'string',
      required: true
    },
    numero_model: {
      type: 'string',
      required: true
    },
    numero_serie: {
      type: 'string',
      required: true

    },
    marque: {
      type: 'string',
     required: true,
    },
    duree_en_service: {
      type: 'string',
    },
    date_en_service: {
      type: 'string',
      required: true,
    },
   
    image: {
      type: 'string',
    },
    ligne:{
      model:'ligne'
    },

    
      demandeinterventions:{
        collection: 'demandeintervention',
        via: 'equipement',
    },


    etatequipements:{
        collection: 'etatequipement',
        via: 'equipement',
    },


   preventive:{
      collection:'preventive',
       via: 'equipement',
   },
    
    
  
    piecerechanges:{
      collection: 'piecerechange',
      via: 'equipements',
  },

  },
  datastores:'sails-mongo',
};

