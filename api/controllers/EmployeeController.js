/**
 * EmployeeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
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
  
    createEmployee: async (req, res) => {
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let email = req.body.email;
        let adresse = req.body.adresse;
        let tel = req.body.tel;
      
        try {
            let password = generatePassword();

          // Créer un nouvel objet Employee avec les données reçues
          const employee = await Employee.create({
            nom,
            prenom,
            email,
            password,
            adresse,
            tel
          });
      
          // Envoyer un email avec les informations de connexion
          sails.hooks.email.send(
            "email_template2",
            { nom, email, password },
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
                  message: "Employé créé avec succès. Les informations de connexion ont été envoyées par e-mail."
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: "Une erreur est survenue lors de la création de l'employé." });
        }
      },
      
    
    add: function(req, res){
        res.json(employee);            
    
    },
    
                /*****************get all **************************/ 
    
       
        getAllEmployee:function(req, res){
            //res.view('list');
            Employee.find({}).exec(function(err, employee){
                if(err){
                    res.send(500, {error:'Database Error'});
                }
                res.send({
                    success: true,
                    status: 200,
                    message: 'Successfully created 1 row in database'
                });
                console.log(employee)
    
            });
        },
                /*****************get by id **************************/ 
    
    getEmployeeById: (req, res) => {
        if (req.method == 'GET' && req.param('id', null) != null) {
            Employee.findOne({id: req.param('id')}).exec((error, employee) => {
                res.send(employee);
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
    
                /*****************update Employee by id **************************/ 
    
    updateEmployee: async(req, res) => {
      
        const nom = req.body.nom;
        const prenom=req.body.prenom;
        const email = req.body.email;
        const password=req.body.password;
        const adresse=req.body.adresse;
        const tel=req.body.tel;
        try{
            console.log(req.body)
            employee = await Employee.update({   id: req.body.id }, 
                                                {nom: req.body.nom ,
                                                prenom:req.body.prenom,
                                                email: req.body.email,
                                                password:req.body.password,
                                                adresse:req.body.adresse,
                                                tel:req.body.tel,
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
                 /*****************delete  Employee by id **************************/ 
    
    deleteEmployee: function(req, res) {
        if (req.method == 'GET' && req.param('id', null) != null) {
            Employee.destroy({id: req.param('id')}).exec((error) => {
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
   
    
    deleteEmployeeWithDemandeInterventionNoPermitted: function(req, res) {
        console.log(req.param('id'))
        if (req.method == 'GET' && req.param('id', null) != null) {
            Demandeintervention.find({employee:req.param('id')}).exec((error, employee) => {
                console.log(employee);
               
                 if (employee.length == 0) {
        
                    console.log('This employee  has no associated demande intervention');
                    //Employee.destroy({id:req.param('id')}).exec(function(employee) {
        
                        res.json({action:"oui"})
        
                    //});
                    //return true;   
        
               }
               else {
         
                    console.log('This employee  has  associated Demande intervention');
                     res.json({action:"non",data:employee})
                      return true;        
                    
        
                }  
            } )
         }
               
        },     



};

