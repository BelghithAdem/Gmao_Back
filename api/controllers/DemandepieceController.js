/**
 *DemandepieceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const demandepieceController = require('./DemandepieceController');
 
 const ejs = require('ejs');
 
 const pdf = require('html-pdf');
 
 
 const moment= require('moment');
module.exports = {
  
    

    createDemandedePiece: async (req, res) => {
        let liste = req.body.liste;
        let intervention = req.body.intervention;
    
        try {
            for (let i = 0; i < liste.length; i++) {
                let piece = liste[i].piece;
                let quantite = liste[i].quantite;
                
                await Demandepiece.create({
                    piece: piece,
                    quantite: quantite,
                    intervention: intervention
                });
            }
    
            res.send({
                success: true,
                status: 200,
                message: 'Successfully created rows in database'
            });
    
        } catch (error) {
            console.log(error);
            res.json({ error: error });
        }
    },
    
 /*****************get all **************************/ 
 updateDemandepiece: async (req, res) => {
    let liste = req.body.liste;
    let intervention = req.body.intervention;

    try {
        await Demandepiece.destroy({intervention:intervention });
        for (let i = 0; i < liste.length; i++) {
            let piece = liste[i].piece;
            let quantite = liste[i].quantite;
            
            await Demandepiece.create({
                piece: piece,
                quantite: quantite,
                intervention: intervention
            });
        }

        res.send({
            success: true,
            status: 200,
            message: 'Successfully created rows in database'
        });

    } catch (error) {
        console.log(error);
        res.json({ error: error });
    }
},
       
 getAlldemandepiece:function(req, res){
    //res.view('list');
    Demandepiece.find({}).exec(function(err,demandepiece){
        if(err){
            res.send(500, {error:'Database Error'});
        }
        res.send({
            success: true,
            status: 200,
            message: 'Successfully getall row in database'
        });
        console.log(pieceintervention)

    });
},
        /*****************get by id demandepiece **************************/ 
getdemandepieceById: (req, res) => {
if (req.method == 'GET' && req.param('id', null) != null) {
    Demandepiece.findOne({id: req.param('id')}).exec((error, demandepiece) => {
        res.send(demandepiece);
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

    /*****************update demandepiece **************************/ 
    getDemandeGroupbyIn: (req, res) => {
      
        // Define the grouping query
        const aggregateArray = [
          {
            $group: {
              _id: "$intervention",
              list: {
                $push: { quantite: "$quantite", piece: "$piece" }
              }
            }
          }
        ];
      
        // Execute the grouping query on the "pieceintervention" collection
        const db =Demandepiece.getDatastore().manager;
        db.collection("demandepiece").aggregate(aggregateArray)
          .toArray(async (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error");
            }
      
            // Loop through the results and enrich each element with additional data
            for (let el of results) {
              const interventionId = el._id.toString();
      
              // Retrieve the corresponding intervention based on the ID
              const resq = await Intervention.findOne({ id: interventionId })
                .populate('taches')
                .populate('ordreintervention')
                .catch(err => {
                  console.log(err);
                  return res.status(500).send("Internal Server Error");
                });
      
              // Retrieve the information of the technician in charge of the work order
              const technicien = await Technicien.findOne({ id: resq.ordreintervention.technicien })
                .catch(err => {
                  console.log(err);
                  return res.status(500).send("Internal Server Error");
                });
      
              // Enrich the element with the retrieved data
              resq.ordreintervention.technicien = technicien;
              el.intervention = resq;
      
              // Retrieve information for each piece of intervention
              for (let elem of el.list) {
                const piece = await Piecerechange.findOne({ id: elem.piece.toString() })
                  .catch(err => {
                    console.log(err);
                    return res.status(500).send("Internal Server Error");
                  });
      
                elem.piece = piece;
              }
            }
      
            res.send(results);
          });
      },
              
         /*****************delete  demandepiece by id **************************/ 
 deleteDemandepiece: function(req, res) {
if (req.method == 'GET' && req.param('id', null) != null) {
    Demandepiece.destroy({id: req.param('id')}).exec((error) => {
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
 
printDemandePiece: async function(req, res) {
    const interventionId = req.param('id');
    try {
        const demandepieces = await Demandepiece.find({ intervention: interventionId }).populateAll();
        console.log(demandepieces);

        const templateData = {
            pieces: demandepieces,
            idintervention: interventionId 
        };

        const ejsOptions = {};
        const html = await ejs.renderFile('views/demandepiece/print.ejs', templateData, ejsOptions);

        const pdfOptions = {
            format: 'A4',
          orientation: 'portrait',
          border: '10mm'
        };
        console.log(html);
        pdf.create(html, pdfOptions).toStream((err, stream) => {
            if (err) {
                return res.serverError(err);
            }
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=intervention${interventionId}.pdf`
            });
            stream.pipe(res);
        });
    } catch (err) {
        return res.serverError(err);
    }
}






};

