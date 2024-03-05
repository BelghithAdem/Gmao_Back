/**
 * TechnicienController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");
const generatePassword = () => {
    const length = 8; // Longueur du mot de passe souhaitée
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  };

module.exports = {
    
/*****************create Technicien **************************/ 

createTechnicien: async (req, res) => {
                let nom = req.body.nom;
                let prenom = req.body.prenom;
                let email = req.body.email;
                let specialite = req.body.specialite;
                let ligne = req.body.ligne;
                let ordreinterventions = req.body.ordreinterventions;
                let adresse= req.body.adresse;
                let tel = req.body.tel;
              
                try {
                    let password = generatePassword();
                  // Créer un nouvel objet Technicien avec les données reçues
                  const technicien = await Technicien.create({
                    nom,
                    prenom,
                    email,
                    password,
                    specialite,
                    ligne,
                    ordreinterventions,
                    adresse,
                    tel
                  });
              
                  // Envoyer un email avec les informations de connexion
                  sails.hooks.email.send(
                    "email_template2",
                    {nom, email, password },
                    {
                      to: email,
                      subject: " Bienvenue dans notre système de GMAO !"
                    },
                    (err) => {
                      if (err) {
                        console.log(err);
                        res.status(500).send({ error: "Une erreur est survenue lors de l'envoi de l'e-mail." });
                      } else {
                        res.status(200).send({
                          success: true,
                          status: 200,
                          message: "Technicien créé avec succès. Les informations de connexion ont été envoyées par e-mail."
                        });
                      }
                    }
                  );
                } catch (error) {
                  console.log(error);
                  res.status(500).send({ error: "Une erreur est survenue lors de la création du technicien." });
                }
},
              

add: function(req, res){

    res.json(technicien);

},

/*****************get all **************************/ 

   
    getAllTechnicien:function(req, res){
        //res.view('list');
        Technicien.find({}).exec(function(err, technicien){
            if(err){
                res.send(500, {error:'Database Error'});
            }
            res.send({
                success: true,
                status: 200,
                message: 'Successfully created 1 row in database'
            });
            console.log(technicien)

        });
    },
/*****************get by id **************************/ 

getTechnicienById: (req, res) => {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Technicien.findOne({id: req.param('id')}).populate('ligne').exec((error, technicien) => {
            res.send(technicien);
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
/*****************update technicien by id **************************/ 

updateTechnicien: async(req, res) => {
  
    const nom = req.body.nom;
    const prenom=req.body.prenom;
    const email = req.body.email;
    const password=req.body.password;
    const specialite=req.body.specialite;
    const ligne=req.body.ligne;
    const adresse=req.body.adresse;

    const tel=req.body.tel;

    const ordreinterventions=req.body.ordreinterventions;
    
    // const interventions=req.body.interventions;

    try{
        console.log(req.body)
        technicien = await Technicien.update(   { id: req.body.id }, 
                                      {nom: req.body.nom,
                                      prenom:req.body.prenom,
                                      email: req.body.email,
                                      password:req.body.password,
                                      specialite:req.body.specialite,
                                      ligne:req.body.ligne,
                                      adresse:req.body.adresse,
                                      tel:req.body.tel,
                                      ordreinterventions:req.body.ordreinterventions,

                                    
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
/*****************delete  technicien by id **************************/ 

deleteTechnicien: function(req, res) {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Technicien.destroy({id: req.param('id')}).exec((error) => {
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

deleteTechnicienWithOrdreNoPermitted: function(req, res) {
    console.log(req.param('id'))
    if (req.method == 'GET' && req.param('id', null) != null) {
        Ordreintervention.find({technicien:req.param('id')}).exec((error, technicien) => {
            console.log(technicien);
           
             if (technicien.length == 0) {
    
                console.log('This Ordre intervention  has no associated technicien');
                res.json({action:"oui"})
                /*   Technicien.destroy({id:req.param('id')}).exec(function(technicien) {
    
                  
    
                });*/
              //  return true;   
           }
           else {
     
                console.log('This technicien  has  associated Ordre intervention');
                 res.json({action:"non",data:technicien})
              //    return true;        
                
    
            }  
        } )
     }
           
    },  

};

