/**
 * PreventiveController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const cron = require('node-cron');


const intervalTime = 86400000 ; // 1 minute in milliseconds

setInterval(async function() {
  let date = new Date();
  let status = 'preventive';
  let priorite = "Normale";

  try {
    const preventiveMaintenances = await Preventive.find().populate('equipement');

    for (let preventiveMaintenance of preventiveMaintenances) {
      if (preventiveMaintenance.interval === 'hebdomadaire') {
        if (preventiveMaintenance.equipement.duree_en_service % 7 === 0 && preventiveMaintenance.etat === 'false') {
          console.log(`Vérification hebdomadaire nécessaire pour l'équipement ${preventiveMaintenance.equipement.libelle}`);
          preventiveMaintenance.etat = 'true';
          let demandeintervention = await Demandeintervention.create({ priorite:priorite,panne:preventiveMaintenance.tache,date:date, description:preventiveMaintenance.description,
            status:status,equipement:preventiveMaintenance.equipement.id,
               
           })
         
          let update = await  Preventive.updateOne({id: preventiveMaintenance.id }, { etat: preventiveMaintenance.etat });
        }
      } else if (preventiveMaintenance.interval === 'mensuel') {
        if (preventiveMaintenance.equipement.duree_en_service >= 30 && preventiveMaintenance.etat === 'false') {
          console.log(`Vérification mensuelle nécessaire pour l'équipement ${preventiveMaintenance.equipement.libelle}`);
          preventiveMaintenance.etat = 'true';
          let demandeintervention = await Demandeintervention.create({ priorite:priorite,panne:preventiveMaintenance.tache,date:date, description:preventiveMaintenance.description,
            status:status,equipement:preventiveMaintenance.equipement.id,
               
           })
          let update = await  Preventive.updateOne({id: preventiveMaintenance.id }, { etat: preventiveMaintenance.etat });
        }
      } else if (preventiveMaintenance.interval === 'trimestriel') {
        if (preventiveMaintenance.equipement.duree_en_service >= 90 && preventiveMaintenance.etat ==='false') {
          console.log(`Vérification trimestrielle nécessaire pour l'équipement ${preventiveMaintenance.equipement.libelle}`);
          preventiveMaintenance.etat = 'true';
          let demandeintervention = await Demandeintervention.create({ priorite:priorite,panne:preventiveMaintenance.tache,date:date, description:preventiveMaintenance.description,
            status:status,equipement:preventiveMaintenance.equipement.id,
               
           })
          let update = await  Preventive.updateOne({id: preventiveMaintenance.id }, { etat: preventiveMaintenance.etat });
        }
      } else if (preventiveMaintenance.interval === 'semestriel') {
        if (preventiveMaintenance.equipement.duree_en_service >= 180 && preventiveMaintenance.etat === 'false') {
          console.log(`Vérification semestrielle nécessaire pour l'équipement ${preventiveMaintenance.equipement.libelle}`);
          preventiveMaintenance.etat = 'true';
          let demandeintervention = await Demandeintervention.create({ priorite:priorite,panne:preventiveMaintenance.tache,date:date, description:preventiveMaintenance.description,
            status:status,equipement:preventiveMaintenance.equipement.id,
               
           })
          let update = await  Preventive.updateOne({id: preventiveMaintenance.id }, { etat: preventiveMaintenance.etat });
        }
      } else if (preventiveMaintenance.interval === 'annuel') {
        if (preventiveMaintenance.equipement.duree_en_service >= 365 && preventiveMaintenance.etat === 'false') {
          console.log(`Vérification annuelle nécessaire pour l'équipement ${preventiveMaintenance.equipement.libelle}`);
          preventiveMaintenance.etat = 'true';
          let demandeintervention = await Demandeintervention.create({ priorite:priorite,panne:preventiveMaintenance.tache,date:date, description:preventiveMaintenance.description,
            status:status,equipement:preventiveMaintenance.equipement.id,
               
           })
          let update = await  Preventive.updateOne({id: preventiveMaintenance.id }, { etat: preventiveMaintenance.etat });
        }
      }
     
    }

    console.log("Verification completed successfully.");
  } catch (err) {
    console.error("Error during verification:", err);
  }
}, intervalTime);


module.exports = {
  
  
  // Action qui permet de créer une nouvelle maintenance préventive pour un équipement donné
 
  create: async function (req, res) {
    let equipmentId = req.body.equipement
    let interval = req.body.interval
    let description = req.body.description
    let tache = req.body.tache
    let etat='false'
    try {

      // Vérification que l'équipement existe
      const equipment = await Equipement.findOne({ id: equipmentId });
      if (!equipment) {
        return res.status(404).json({ message: "Equipement non trouvé" });
      }

      // Création de la maintenance préventive
      const preventiveMaintenance = await Preventive.create({
        equipement: equipmentId,
        interval,
        description,
        tache,
        etat
      }).fetch();

      return res.status(201).json(preventiveMaintenance);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  update: async function (req, res) {
    let equipmentId = req.body.equipement
    let interval = req.body.interval
    let description = req.body.description
    let tache = req.body.tache
    try {
      const equipment = await Equipement.findOne({ id: equipmentId });
      if (!equipment) {
        return res.status(404).json({ message: "Equipement non trouvé" });
      }
      // Vérification que la maintenance préventive existe
      const preventiveMaintenance = await Preventive.update(
         { id: req.body.id }, 
        
        {
        equipement: equipmentId,
        interval,
        description,
        tache,
      }).fetch();

      return res.status(201).json(preventiveMaintenance);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },


  findById: async function (req, res) {
    try {
        // Vérification que la maintenance préventive existe
      const preventiveMaintenance = await Preventive.findOne({ id: req.query.id});
      if (!preventiveMaintenance) {
        return res.status(404).json({ message: "Maintenance préventive non trouvée" });
      }
  
      return res.status(200).json(preventiveMaintenance);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  


  findall: async function (req, res) {
    try {
      const preventiveMaintenances = await Preventive.find().populate('equipement');
      return res.status(200).json(preventiveMaintenances);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },


  // Mettre à jour une maintenance préventive existante
  
  
  // Supprimer une maintenance préventive existante
  destroy: async function(req, res) {
    try {
      const preventiveMaintenance = await Preventive.destroyOne({ id: req.query.id });
      if (!preventiveMaintenance) {
        return res.status(404).json({ error: 'Maintenance préventive not found' });
      }
      return res.status(200).json({ Preventive: 'Maintenance préventive deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.Preventive });
    }
  },
 
 

  
  
  




  







};

