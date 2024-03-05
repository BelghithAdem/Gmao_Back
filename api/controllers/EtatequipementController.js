/**
 * EtatequipementController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    createEtatEquipement: async (req, res) => {
        console.log(req.body)
        let nometat=req.body.nometat ;
        let datetat=req.body.dateetat ;
        let equipement=req.body.equipement;
        

            try{
            etatequipement = await Etatequipement.create(req.body).fetch()
                res.json({etatequipement :'create Successfully '})
                console.log(etatequipement);
                
        }  
        catch(error){
       console.log(error);
            res.json({etatequipement :'Database err'})
           
        }
    },
    
    add: function(req, res){
        res.json(etatequipement);            
    
    },

  /*****************get all **************************/ 
  getAllEtatequipement:function(req, res){
    Etatequipement.find({}).exec(function(err, etatequipement){
        if(err){
            res.send(500, {error:'Database Error'});
        } 
        res.send({
            success: true,
            status: 200,
            message: 'Successfully getall row in database'
        });
        console.log(etatequipement)

    });
},
 /*****************get by id **************************/ 
getEtatequipementtById: (req, res) => {
if (req.method == 'GET' && req.param('id', null) != null) {
    Etatequipement.findOne({id: req.param('id')}).exec((error, etatequipement) => {
        res.send(etatequipement);
        return;
    });
} else {
    res.send({
        success: false,
        status: 500,
        message: 'Error in request'
    });
    return;
}
},

        /*****************update Etatequipement **************************/ 

updateEtatequipementt: async(req, res) => {

    const nometat=req.body.nometat ;
    const datetat=req.body.dateetat ;
    const equipement=req.body.equipement;



try{
    console.log(req.body)
    etatequipement = await Etatequipement.update({ id: req.body.id }, 
                                  { nometat: req.body.nometat ,
                                    datetat:req.body.datetat,
                                    equipement: req.body.equipement,
                                   

                                 })
    res.send({
        success: true,
        status: 200,
        message: 'Successfully updated 1 row in database'
    });
}
catch(error){
    res.send({
        success: false,
        status: 500,
        message: 'Wrong data'
    });
}   
},
         /*****************delete  Etatequipement by id **************************/ 

deleteEtatequipementt: function(req, res) {
if (req.method == 'GET' && req.param('id', null) != null) {
    Etatequipement.destroy({id: req.param('id')}).exec((error) => {
        res.send({
            success: true,
            status: 200,
            message: 'Successfully deleted 1 row in database'
        });
        return;
    });
} else {
    res.send({
        success: false,
        status: 500,
        message: 'Unable to delete'
    });
    return;
}
},
getEquipementStats: async (req, res) => {
    try {
      const equipements = await Equipement.find({});
      console.log(equipements)
      const stats = {};
      for (const equipement of equipements) {
        const count = await Etatequipement.count({ equipement: equipement.id, nometat: 'en panne' });
        stats[equipement.libelle+equipement.numero_serie] = count;
      }
      res.json(stats);
    } catch (error) {
      res.json({ error: 'Database error' });
    }
  }
  
  
  

};

