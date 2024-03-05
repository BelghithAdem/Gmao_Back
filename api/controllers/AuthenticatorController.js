/**
 * AuthenticatorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


module.exports = {

    Authentifier: function (req, res) {

        console.log(req.body);
        
        if (!req.body.email || !req.body.password) {
          return res.status(400).json({ error: "Email and password are required" });
        }


        if (req.method == 'POST') {
                 
                    const admin = Admin.find({ email: req.body.email, password: req.body.password }, {}).exec((error, admin) => {

                        console.log("Admin connexion")

                        console.log(admin);
                        console.log(req.body.email);
                        console.log(req.body.password);


                        if (admin.length > 0) {

                            const token = jwt.sign({ id: admin[0].id, role: 'admin' }, 'your_secret_key');

                            req.session.authenticated = true;

                            res.json({ status: true, role: "admin", user: admin, token });

                        }
                        else {

                            const technicien = Technicien.find({ email: req.body.email, password: req.body.password }, {}).exec((error, technicien) => {

                                console.log(" technicien conexion")


                                console.log(technicien);
                                console.log(req.body.email);
                                console.log(req.body.password);

                                if (technicien.length > 0) {
                                    const token = jwt.sign({ id: technicien[0].id, role: 'technicien' }, 'your_secret_key');


                                    req.session.authenticated = true;
                                    res.json({ status: true, role: "technicien", user: technicien, token });



                                }



                                else {

                                    const employee = Employee.find({ email: req.body.email, password: req.body.password }, {}).exec((error, employee) => {

                                        console.log(" employee conexion")

                                        console.log(employee);
                                        console.log(req.body.email);
                                        console.log(req.body.password);

                                        if (employee.length > 0) {
                                            const token = jwt.sign({ id: employee[0].id, role: 'employee' }, 'your_secret_key');


                                            req.session.authenticated = true;


                                            res.json({ status: true, role: "employee", user: employee, token });






                                        }
                                        else {
                                            res.json({ status: false, role: 'none', user: null })

                                        }

                                    });

                                }

                            });

                        }
                    });
                
            
        }
        else {

            res.json({ msg: "GET NOT ALLOAWED" })
        }

    },

    logout: function (req, res) {


        req.session.authenticated = false;
        req.session.destroy(function (err) {
            return res.json({ task: 'ok' })
        });

    },

    updateSelonRole: function (  req, res) {



        if (req.method == 'POST') {

            // get params from post ;)
            var role=req.body.role;
            var obj=req.body.data;


               
                 if (role=="admin"){
                    const admin = Admin.update({id:req.body.id}).set(req.body.data).exec((error, admin) => {


                        this.admin=obj;
                        res.json("updated successfully",201)


                    })
                           

                }
                else if (role=="technicien"){
                    const technicien = Technicien.update({id:req.body.id}).set(req.body.data).exec((error, technicien) => {
                        this.technicien=obj;
                        res.json("updated successfully",201)
                    })
                           

                }
                else if (role=="employee"){
                    const employee = Employee.update({id:req.body.id}).set(req.body.data).exec((error, employee) => {
                        this.employee=obj;
                        res.json("updated successfully",201)


                    })
                       
                          

                }
                else {
                    //res.error('sorry get not permitted ',400)
                    res.json('update problem ',403)
                }
       
         }      else {
            //res.error('sorry get not permitted ',400)
            res.json('sorry get not permitted ',400)
        }
        
    },
      getPasswordByEmail: function (req, res) {

        if (req.method == 'POST') {
          const email = req.body.email;
      
          const admin = Admin.find({ email: email }, {}).exec((error, admin) => {
            if (admin.length > 0) {
              req.session.authenticated = true;
              const password = admin[0].password;
      
              sails.hooks.email.send(
                "email_template",
                { password },
                {
                  to: email,
                  subject:'Mot de passe oublié'
                },
                function (err) {
                  if (err) {
                    return res.serverError({ res: 'false', message:"L'opération a échoué .Veullez vérifier l'adresse e-mail que vous avez saisie" });
                  } else {
                    return res.json({ res: 'true', message:"Votre mot de passe a été envoyé avec succés .Vérifiez votre courrier"});
                  }
                }
              );
      
            } else {
              const technicien = Technicien.find({ email: email }, {}).exec((error, technicien) => {
                if (technicien.length > 0) {
                  req.session.authenticated = true;
                  const password = technicien[0].password;
                  sails.hooks.email.send(
                    "email_template",
                    { password },
                    {
                      to: email,
                      subject: `Mot de passe oublié`
                    },
                    function (err) {
                      if (err) {
                        return res.serverError({ res: 'false', message:"L'opération a échoué .Veullez vérifier l'adresse e-mail que vous avez saisie" });
                      } else {
                        return res.json({ res: 'true', message:"Votre mot de passe a été envoyé avec succés .Vérifiez votre courrier"});
                      }
                    }
                  );
      
                } else {
                  const employee = Employee.find({ email: email }, {}).exec((error, employee) => {
                    if (employee.length > 0) {
                      req.session.authenticated = true;
                      const password = employee[0].password;
                      sails.hooks.email.send(
                        "email_template",
                        { password },
                        {
                          to: email,
                          subject: `Mot de passe oublié`
                        },
                        function (err) {
                          if (err) {
                            return res.serverError({ res: 'false', message:"L'opération a échoué .Veullez vérifier l'adresse e-mail que vous avez saisie" });
                          } else {
                            return res.json({ res: 'true', message:"Votre mot de passe a été envoyé avec succés .Vérifiez votre courrier"});
                          }
                        }
                      );
      
                    } else {
                      return res.json({ res: 'false', message:"L'opération a échoué .Veullez vérifier l'adresse e-mail que vous avez saisie" })
                    }
                  });
                }
              });
            }
          });
      
        } else {
          res.json({ msg: "GET NOT ALLOAWED" })
        }
      
      }
      
      
      
      
};  
