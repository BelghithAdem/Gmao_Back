/**
 * EquipementController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    upload: async (req, res) => {


    //    console.log(req.file('file'))
        console.log("*************")
         console.log(req.file('file'))
  
 
 
       var fileName;
        try{

            fileName=req.file('file')._files[0].stream.headers['content-disposition'].split('"').reverse()[1];
            console.log(fileName)
        }
        catch(e){
         // fileName="abc.abc";
        }
        req.file('file').upload({
          dirname:'../../assets/images/',
          saveAs:fileName
        },async function  onUploadComplete(err,files){
          if(err){
            console.log(err);
            return res.serverError(err);
          }
          if(!files.length) {
            return res.serverError(new Error('No file Uploaded'))
          }

          res.send( {
            success: true,
            status: 200,
            fileName:fileName,
            message: 'Successfully created 1 row in database'
        });

        //  res.ok(files);
             
        }); 


     

        
    },
    add: async function(req, res) {
        let today = new Date();
        today = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
        const date_en_service = new Date(req.body.date_en_service); // conversion en date JavaScript
        const diff_ms = Date.now() - date_en_service.getTime(); // calcul de la différence en millisecondes
        const diff_days = Math.floor(diff_ms / (1000 * 60 * 60 * 24)); // conversion en jours entiers
        try {
            console.log('debut ajout');
            var equipement = await Equipement.create({
                libelle: req.body.libelle,
                image: req.body.image,
                numero_model: req.body.numero_model,
                piecerechanges: req.body.piecerechanges,
                demandeinterventions: req.body.demandeinterventions,
                numero_serie: req.body.numero_serie,
                marque: req.body.marque,
                duree_en_service: diff_days, // stockage de la différence en jours
                date_en_service: req.body.date_en_service,
                ligne: req.body.ligne
            }).fetch();
    
            var etatequipement = await Etatequipement.create({
                nometat: "nouveau",
                dateetat: today,
                equipement: equipement.id,
                status: 'actuelle'
            }).fetch();
    
            console.log(etatequipement);
            res.send(equipement);
        } catch (error) {
            console.log(error);
            res.send(500, { error: 'Database error' });
        }
    },
    
     /*****************get all **************************/ 
    
       
     getAllEquipement:function(req, res){
        //res.view('list');
        Equipement.find({}).exec(function(err, equipement){
            if(err){
                res.send(500, {error:'Database Error'});
            }
            res.send({
                success: true,
                status: 200,
                message: 'Successfully getall row in database'
            });
            console.log(equipement)

        });
    },
            /*****************get by id **************************/ 

getEquipementById: (req, res) => {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Equipement.findOne({id: req.param('id')}).exec((error, equipement) => {
            res.send(equipement);
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

            /*****************update equipement **************************/ 
updateEquipement: async (req, res) => {
                const date_en_service = new Date(req.body.date_en_service); // conversion en date JavaScript
                const diff_ms = Date.now() - date_en_service.getTime(); // calcul de la différence en millisecondes
                const diff_days = Math.floor(diff_ms / (1000 * 60 * 60 * 24)); // conversion en jours entiers
                let today = new Date();
                today = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
                
                try {
                    console.log(req.body);
                    equipement = await Equipement.update(
                        { id: req.body.id }, 
                        {   
                            libelle: req.body.libelle,
                            ligne: req.body.ligne,
                            numero_model: req.body.numero_model,
                            numero_serie: req.body.numero_serie,
                            marque: req.body.marque,
                            duree_en_service: diff_days, // stockage de la différence en jours
                            date_en_service: req.body.date_en_service,
                            etatequipements: req.body.etatequipements,
                            image: req.body.image,
                            demandeinterventions: req.body.demandeinterventions,
                            piecerechanges: req.body.piecerechanges
                        }
                    ).fetch();
            
                    var etatequipement = await Etatequipement.create({
                        nometat: "nouveau",
                        dateetat: today,
                        equipement: req.body.id,
                        status: 'actuelle'
                    }).fetch();
            
                    console.log(etatequipement);
                    res.send(equipement);
                } catch (error) {
                    console.log(error);
                    res.send(500, { error: 'Database error' });
                }
            },
            
             /*****************delete  Equipement by id **************************/ 

deleteEquipement: function(req, res) {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Equipement.destroy({id: req.param('id')}).exec((error) => {
            res.send({
                success: true,
                status: 200,
                message: 'Successfully deleted 1 row in database'
            });
            //return;
        });
    } else {
        res.send({
            success: false,
            status: 500,
            message: 'Unable to delete'
        });
        //return;
    }
},
 getAllEquipementByLigne:function (req,res){

    if (req.method == 'GET' && req.param('id', null) != null) {
        Equipement.find({ligne: req.param('id')}).exec((error, equipement) => {
            res.send(equipement);
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
deleteEquipementWithdemandeInterventionNoPermitted: function(req, res) {
    console.log(req.param('id'))
    if (req.method == 'GET' && req.param('id', null) != null) {
        Etatequipement.find({equipement:req.param('id')}).exec((error, equipement) => {
            console.log(equipement);
             if (equipement.length == 0) {
                console.log('This Equipement  has no associated Etatequipement');
                res.json({action:oui})
           }
           else {
                console.log('This Equipement  has  associated with Etatequipement');
                 res.json({action:"non",data:equipement})
                  return true;        
            }  
        } )
     }
           
    },  


};

