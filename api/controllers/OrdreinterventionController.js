/**
 * OrdreinterventionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");


module.exports = {
  
    createOrdreintervention: async (req, res) => {
        console.log(req.body);
      
        let nature_de_travaux = req.body.nature_de_travaux;
        let technicien = req.body.technicien;
        let degre_urgence = req.body.degre_urgence;
        let demandeintervention = req.body.demandeintervention;
        let description = req.body.description;
        let dateestimation = req.body.dateestimation;
        let debutprevu = req.body.debutprevu;
        let  finprevu = req.body.finprevu;

        let etat = 'initiale';
        let periodeEtim = req.body.pe;
      
        console.log("**************" + demandeintervention);
      
        try {
          const ordreintervention = await Ordreintervention.create({
            debutprevu: debutprevu,
            finprevu: finprevu,
            dateestimation: dateestimation,
            description: description,
            etat: etat,
            nature_de_travaux: nature_de_travaux,
            demandeintervention: demandeintervention,
            degre_urgence: degre_urgence,
            technicien: technicien,
          }).fetch();
      
          const status = 'initiale';
          console.log(req.body.status);
          console.log("statusss demande");
      
          const updatedDemandeintervention = await Demandeintervention.updateOne({ id: demandeintervention })
            .set({ status: 'valider' });
      
          // if (etat == "annuler") {
          //   let demande = await Demandeintervention.update({ id: demandeintervention }, { status: 'reinitialiser' })
          // }
          if (etat == "bien reçu") {
            const updatedDemandeintervention = await Demandeintervention.updateOne({ id: demandeintervention })
              .set({ status: 'valider' });
          }
          // else if (etat == "rejetee") {
          //     let demande = await Demandeintervention.update({id:demandeintervention},{status:'reinitialiser'})
          // }
      
          console.log(ordreintervention);
          const technicienData = await Technicien.findOne({ id: technicien });
          const demandeinterventionData = await Demandeintervention.findOne({ id:demandeintervention});
          const equipementData=await Equipement.findOne({id:demandeinterventionData.equipement})
          const ligneData=await Ligne.findOne({id:equipementData.ligne})

          const  datearretmachine =demandeinterventionData.dureearretmachine
          const email = technicienData.email;
          const nom = technicienData.nom;
          const prenom = technicienData.prenom;
          const libele=equipementData.libelle
          const ligne=ligneData.nom_ligne

          sails.hooks.email.send(
            "email_template3",
            {nom,prenom,libele,ligne,datearretmachine,degre_urgence,nature_de_travaux },
            {
              to: email,
              subject: "Ordre d'intervention pour la réparation d'un équipement!"
            },
            (err) => {
              if (err) {
                console.log(err);
                res.status(500).send({ error: "Une erreur est survenue lors de l'envoi de l'e-mail." });
              } else {
                res.status(200).send({
                  success: true,
                  status: 200,
                  message: "L'ordre d'intervention a été créé avec succès. Les informations de connexion ont été envoyées par e-mail."
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: "Une erreur est survenue lors de la création de l'ordre d'intervention." });
        }
      },
      

/*************** ordre affecté par nom technicien préciser selon le user connecté ****************/

getOrdreSelonUserConnected:function(req,res) { 
    console.log(req.param('idTech'))
    Ordreintervention.find({technicien:req.param('idTech'),etat:{'!=':["annuler","cloturer"]}}).populateAll().exec(function(error, ordreintervention){
       //.find().where({or:[{status :  'cloturer' }]})
        if(error) {
                res.json(500, {error:error});
             }
             for (let i = 0; i < ordreintervention.length; i++) {
                 const el = ordreintervention[i];
                 Equipement.findOne({id:el.demandeintervention.equipement}).exec(function(err, equi){
                    if(err){
                        res.send(500, {error:'Database Error'});
                    }
                    el.demandeintervention.equipement=equi;
                    if(i ===ordreintervention.length-1){
                        res.json(ordreintervention )
                        console.log("hhhhhhhhhhhhhh")
                        console.log(ordreintervention)
                    }
                });
             }  
            });

},

 /**************** get liste ordre non traité SelonUserConnected when etat Ordre intervention =rejetee  **********/
 getListOrdreInterventionNontraite:function (req,res) {
   //Ordreintervention.find().where({technicien:req.param('idTech'),{etat: ['en cours','cloturer','suspenduTech','suspenduAdmin']}})populateAll().exec(function (err, ordreintervention) {
     Ordreintervention.find().where({technicien:req.param('idTech'),etat:'initiale'}).populate('technicien').populate('demandeintervention').populate('intervention').exec(function (err, ordreintervention) {
        if(err){
            res.json(500, {error:err});
        }
        for (let i = 0; i < ordreintervention.length; i++) {
            const el = ordreintervention[i];
            Equipement.findOne({id:el.demandeintervention.equipement}).exec(function(err, equi){
               if(err){
                   res.send(500, {error:'Database Error'});
               }
               el.demandeintervention.equipement=equi;
               if(i ===ordreintervention.length-1){
                   res.json(ordreintervention )
                   console.log("hhhhhhhhhhhhhh")
                   console.log(ordreintervention)
               }
           });
        }
       });
      
    },
  
     /**************** get liste ordre traité when etat Ordre intervention =cloturer **********/

 getListOrdreInterventiontraite:function (req,res){
    Ordreintervention.find().where({technicien:req.param('idTech'),etat:'cloturer'}).populate('technicien').populate('demandeintervention').populate('intervention').exec(function (err, ordreintervention) {
        if(err){
            res.json(500, {error:err});
        }
        for (let i = 0; i < ordreintervention.length; i++) {
            const el = ordreintervention[i];
            Equipement.findOne({id:el.demandeintervention.equipement}).exec(function(err, equi){
               if(err){
                   res.send(500, {error:'Database Error'});
               }
               el.demandeintervention.equipement=equi;
               
               if(i ===ordreintervention.length-1){
                   res.json(ordreintervention)
                   console.log("hhhhhhhhhhhhhh")
   
                   console.log(ordreintervention)
               }
           });
        }
    });
        
        // res.json(ordreintervention )
        // console.log(ordreintervention)

        // });
    },
  


  /***************** update etat ordre  by id valider bien recu **************************/ 
    
  UpdateEtat: async(req, res) => {
    const etat='initiale';
  console.log( req.body.etat )
  let today=new Date();
  //var equipement=req.body.equipement;

  today = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()
  
           
           if(req.body.etat=="valider"){
            var  ordreintervention = await Ordreintervention.update(
                {id: req.body.id }, 
                {etat: req.body.etat, 
                //description:req.body.description,
                date :req.body.date},
                )
                
                  res.json({action:"valider",date:today,data:ordreintervention,ordreintervention :'MAJ Etat Successfully'} )
                  console.log(req.body.etat) 
                  
                  console.log(req.body.date)
                } 
                else{
                     let oi = await Ordreintervention.update({id:req.body.idOrdre},{etat:'bien reçu'})
                     let demande = await Demandeintervention.update({id:req.body.id},{status:'valider'})
                     //etatequipement = await Etatequipement.create ({nometat:"en panne",dateetat:today,equipement:equipement,status:'actuelle'})
                    res.json({action:"bien reçu",date:today,data:ordreintervention,ordreintervention :'MAJ Etat Successfully'} )
                    console.log(req.body.etat); 
                    console.log(req.body.date)

                } 
      
        },

        /*******************change etat Rejetee ***********************/
 Updatestatus: async(req, res) => {
            const etat='initiale';
          console.log( req.body )
          let today=new Date();

          today = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()
               
                        if(req.body.etat=="rejetee"){
                          let oi = await Ordreintervention.update({id:req.body.idOrdre},{etat:'rejetee',
                          description:req.body.description,
                        })
                          let demande = await Demandeintervention.update({id:req.body.id},{status:'reinitialiser'})
                          res.json({action:true,status :'MAJ Etat Successfully'})
                          console.log(req.body.etat)
                          console.log(req.body.description)
                          console.log(req.body.date)
        
                        }

                },
    
    add: function(req, res){
        res.json(ordreintervention);            
    
    },
      /*****************changer etat reinialiser par admin **************************/ 
      ChangeEtat: async(req, res) => {
        const etat='initiale';
      console.log( req.body.etat )
      let today=new Date();
    
      today = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()
            try{
                
               if(req.body.etat=="rejetee"){
                //let demande = await Demandeintervention.update({id:req.body.id},{status:'reinitialiser'})
                      res.json({action:"rejetee",ordreintervention :'MAJ Etat Successfully'} )
                      console.log(req.body.etat) 
                    } 
                }
                    catch(error){
                        res.json({error:error})
                    }
            },
/*******************change etat reinialiser in exception ***********************/
ChangeEtatReinialiser: async(req, res) => {
    const etat='initiale';
  console.log( req.body.etat )
  let today=new Date();

  today = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()
        try{
            
           if(req.body.etat=="rejetee"){
            let demande = await Demandeintervention.update({id:req.body.id},{status:'reinitialiser'})
                  res.json({action:"rejetee",ordreintervention :'MAJ Etat Successfully'} )
                  console.log(req.body.etat) 
                } 
            }
                catch(error){
                    res.json({error:error})
                }
        },

/*******************change etat annuler ***********************/
ChangeEtat: async(req, res) => {
    const etat='initiale';
  console.log( req.body.etat )
  let today=new Date();
  //var equipement=req.body.equipement;

  today = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()
        try{
            // let updatedRow=Etatequipement.find({equipement:equipement}).exec( async (err,list)=> {
           
            //     list.forEach( async  (element)   => {
            //      let   demandeintervention = await Etatequipement.update({id:element.id},{status:'ancien'})
            //     });
           
           if(req.body.etat=="annuler"){
           // etatequipement = await Etatequipement.create ({nometat:"en marche",dateetat:today,equipement:equipement,status:'actuelle'})
            let oi = await Ordreintervention.update({id:req.body.idOrdre},{etat:'annuler'})
            let demande = await Demandeintervention.update({id:req.body.id},{status:'reinitialiser'})

                  res.json({action:"annuler",ordreintervention :'MAJ Etat Successfully'} )
                  console.log(req.body.etat) 
                  

                } 
          // })

            }
                catch(error){
                    res.json({error:error})
                   
                }
      
      
        },
       
 getAllordreIntervention:function(req, res){
        //res.view('list');
        Ordreintervention.find({}).populateAll().exec(function(err, ordreintervention){
            
            if(err){
                res.send(500, {error:'Database Error'});
            }

            for (let i = 0; i < ordreintervention.length; i++) {
                const el = ordreintervention[i];


                Equipement.findOne({id:el.demandeintervention.equipement}).exec(function(err, equi){
           
                   if(err){
                       res.send(500, {error:'Database Error'});
                   }
                   el.demandeintervention.equipement=equi;
                   
                   if(i ===ordreintervention.length-1){
                       res.json(ordreintervention)
                       console.log("hhhhhhhhhhhhhh")
       
                       console.log(ordreintervention)
                   }
               });
                
            }


        

        });
    },
            /*****************get by id **************************/ 

getOrdreinterventionById: (req, res) => {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Ordreintervention.findOne({id: req.param('id')}).populateAll().exec((error, ordreintervention) => {

            Equipement.findOne({id:ordreintervention.demandeintervention.equipement}).exec(function(err, equi){
            
                if(err){
                    res.send(500, {error:'Database Error'});
                }
                ordreintervention.demandeintervention.equipementx=equi;
                res.send(ordreintervention);

                console.log(ordreintervention)
                return;
            });
           
          
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

            /*****************update Service **************************/ 
updateordreintervention: async(req, res) => {
                const nature_de_travaux = req.body.nature_de_travaux;
                const technicien = req.body.technicien;
                const degre_urgence = req.body.degre_urgence;
                const demandeintervention = req.body.demandeintervention;
                const description = req.body.description;
                const dateestimation = req.body.dateestimation;
                const debutprevu = req.body.debutprevu;
                const finprevu = req.body.finprevu;
                let etat = 'initiale';

                try {
                  console.log(req.body);
              
                  ordreintervention = await Ordreintervention.update(
                    { id: req.body.id },
                    {
                      nature_de_travaux:nature_de_travaux,
                      degre_urgence: degre_urgence,
                      technicien:  technicien,
                      demandeintervention: demandeintervention,
                      description:description,
                      debutprevu:debutprevu,
                      finprevu:  finprevu ,
                      dateestimation:  dateestimation,
                      etat:etat,
                    }
                  ).fetch();
              
                  const technicienData = await Technicien.findOne({ id: technicien });
                  const demandeinterventionData = await Demandeintervention.findOne({ id: demandeintervention });
                  const equipementData = await Equipement.findOne({ id: demandeinterventionData.equipement });
                  const ligneData = await Ligne.findOne({ id: equipementData.ligne });
              
                  const datearretmachine = demandeinterventionData.dureearretmachine;
                  const email = technicienData.email;
                  const nom = technicienData.nom;
                  const prenom = technicienData.prenom;
                  const libele = equipementData.libelle;
                  const ligne = ligneData.nom_ligne;
              
                  sails.hooks.email.send(
                    "email_template3",
                    {
                      nom,
                      prenom,
                      libele,
                      ligne,
                      datearretmachine,
                      degre_urgence,
                      nature_de_travaux,
                    },
                    {
                      to: email,
                      subject: "Ordre d'intervention pour la réparation d'un équipement!",
                    },
                    (err) => {
                      if (err) {
                        console.log(err);
                        res
                          .status(500)
                          .send({ error: "Une erreur est survenue lors de l'envoi de l'e-mail." });
                      } else {
                        res.status(200).send({
                          success: true,
                          status: 200,
                          message:
                            "L'ordre d'intervention a été créé avec succès. Les informations de connexion ont été envoyées par e-mail.",
                        });
                      }
                    }
                  );
                } catch (error) {
                  res.send({
                    success: false,
                    status: 500,
                    message: "Wrong data",
                  });
                }
 },


findordrebytechnicien: (req, res) => {
 if (req.method == 'GET' && req.param('id', null) != null) {
      Ordreintervention.find({technicien: req.param('id')}).populateAll().exec((error, ordreinterventions) => {
             if (error) {
                 res.send(500, {error: 'Database Error'});
                 return;
                 }
                        res.send(ordreinterventions);
                        console.log(ordreinterventions);
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
                         /*****************delete  ordre intervention by id **************************/ 

deleteordreintervention: function(req, res) {
    if (req.method == 'GET' && req.param('id', null) != null) {
        Ordreintervention.destroy({id: req.param('id')}).exec((error) => {
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

getInterventionByTechnicienFromDay: (req, res) => {
    if (req.method == 'GET' && req.param('id', null) != null) {
        
    Ordreintervention.find().where({technicien:req.param('id'),etat:'en cours'}).populate('technicien').populate('demandeintervention').exec(function (err, ordreintervention) {
            console.log(ordreintervention)

            res.json(ordreintervention)
          });
     }
},  

CountOrdreExceptionBienRecu:async (req,res)=>{
    if (req.method == 'GET' ) {
        // id:intervention.ordreintervention.technicien
        Ordreintervention.find().where( {etat:['bien reçu','rejetee']}).exec(function (err, ordreintervention) {
            if(err){
                res.json(500, {error:err});
            }
            res.json({totalOrdre:ordreintervention.length});
            });
        console.log('*************totalOrdre***************')
    } else {
        res.send({
            success: false,
            status: 500,
            message: 'Error in request'
        });
        return;
    }
},
getlistordreNotif:(req,res)=>{
    Ordreintervention.find({etat:['bien reçu','rejetee']}).populateAll().exec(function (err, ordreintervention) {
      

            Intervention.find({etat:['arreter','en attente des pieces']}).exec(function (err,intervention){


                Demandeintervention.find({status:['initiale','reinitialiser','en cours']}).exec(function (err,demandeintervention){


                    res.json({ordre:ordreintervention.length,intervention:intervention.length,demande:demandeintervention.length})


                })



            })

    });
},
getlistStat:(req,res)=>{

    let m=[];

    Ordreintervention.find({etat:['en cours']}).populateAll().exec(function (err, ec) {
      
        m.push(ec.length)
            Ordreintervention.find({etat:['cloturer']}).exec(function (err,tr){
                m.push(tr.length)


                Ordreintervention.find({etat:['suspenduAdmin']}).exec(function (err,enp){
                    m.push(enp.length)


                    Ordreintervention.find({etat:['suspenduTech']}).exec(function (err,arr){
                        m.push(arr.length)


                        Ordreintervention.find({etat:['bien reçu']}).exec(function (err,sus){
                            m.push(sus.length)


                            Ordreintervention.find({etat:['rejetee']}).exec(function (err,reje){
                                m.push(reje.length)
    
    
                                Ordreintervention.find({etat:['annuler']}).exec(function (err,annu){
                                    m.push(annu.length)
        
        
                                    res.json(m)
                
                
                                })    
            
            
                            })    
        
        
                        })                
    
                    })            

                })



            })











    });
},

countListOrdreInterventionNontraite: function(req, res) {
    const idTechnicien = req.body.id;
    Technicien.findOne({id: idTechnicien}).exec(function(err, technicien) {
        if(err) {
            res.json(500, {error: err});
        }
        if(!technicien) {
            res.json(404, {error: "Technicien not found"});
        }
        Ordreintervention.count({technicien: technicien.id, etat: 'initiale'}).exec(function(err, count) {
            if(err) {
                res.json(500, {error: err});
            }
            res.json({technicien: technicien.id, count: count});
        });
    });
}








}



       

