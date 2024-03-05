/**
 * Preventive.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {


    interval: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    tache: {
      type: 'string',
      required: true
    },
    etat:{
      type:'string',
      required:false
    },
   
    equipement:{
      model: 'equipement',
    },  
  },

};

