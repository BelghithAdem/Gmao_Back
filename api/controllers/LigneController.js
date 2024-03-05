/**
 * LigneController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    createLigne: async (req, res) => {
        let nom_ligne = req.body.nom_ligne;
        let techniciens=req.body.techniciens;
        let equipements =req.body.equipements;
        
        try{
          ligne = await Ligne.create(
                {nom_ligne:nom_ligne,techniciens:techniciens, equipements:equipements})
            
                res.send( {
                    success: true,
                    status: 200,
                    message: 'Successfully created 1 row in database'
                });
                console.log(ligne);
                
        }  
        catch(error){
            res.send(500, {error:'Database error'});
            res.status(status).send(body)
        }
    },
    
    add: function(req, res){
        res.json(ligne);            
    
    },
      /*****************get all **************************/ 
    
       
      getAllLigne:function(req, res){
        //res.view('list');
        Ligne.find({}).exec(function(err, ligne){
            if(err){
                res.send(500, {error:'Database Error'});
            }
            res.send({
                success: true,
                status: 200,
                message: 'Successfully getall row in database'
            });
            console.log(ligne)

        });
    },
            /*****************get by id **************************/ 

getLigneById: (req, res) => {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Ligne.findOne({id: req.param('id')}).exec((error, ligne) => {
            res.send(ligne);
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

            /*****************update Ligne **************************/ 

updateLigne: async(req, res) => {
  
    const nom_ligne = req.body.nom_ligne;
    const techniciens=req.body.techniciens;
    const equipements = req.body.equipements;



    //const etablissement=req.body.etablissement;
    try{
        console.log(req.body)
        ligne = await Ligne.update(   { id: req.body.id }, 
                                      {nom_ligne: req.body.nom_ligne ,
                                        techniciens:req.body.techniciens,
                                        equipements: req.body.equipements,
                                
                                      //etablissement:req.body.etablissement
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
             /*****************delete  Ligne by id **************************/ 

deleteLigne: function(req, res) {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Ligne.destroy({id: req.param('id')}).exec((error) => {
            res.send({
                success: true,
                status: 200,
                message: 'Successfully deleted 1 row in database'
            });
        });
    } else {
        res.send({
            success: false,
            status: 500,
            message: 'Unable to delete'
        });
    }
},


    
deleteLigneWithequipementNoPermitted: function(req, res) {
    console.log(req.param('id'))
if (req.method == 'GET' && req.param('id', null) != null) {
    Equipement.find({ligne:req.param('id')}).exec((error, ligne) => {
        console.log(ligne);
         if (ligne.length == 0) {

            console.log('This ligne  has no associated Equipement');
            // Ligne.destroy({id:req.param('id')}).exec(function(ligne) {
            // }); 
            res.json({action:"oui"})
       }
       else {
 
            console.log('This ligne  has  associated piece rechange');
             res.json({action:"non",data:ligne})
              return true;        
            

        }  
    } )
 }
       
},  
       
};

