
module.exports = {

  attributes: {
  
    nom_ligne: {
      type: 'string',
      required: true
    },
    techniciens:{
      collection: 'technicien',
      via: 'ligne'
  },
   equipements:{
     collection: 'equipement',
     via: 'ligne'
 }
    },
    

  datastores:'sails-mongo',


};

