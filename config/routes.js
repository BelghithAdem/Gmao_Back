/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
// '/admin/create': 'AdminController.createAdmin',
// '/admin/getall': 'AdminController.getAllAdmin',
// '/admin/getbyid/:id': 'AdminController.getAdminById',
// '/admin/update/:id': 'AdminController.updateAdmin',
// '/admin/delete/:id': 'AdminController.deleteAdmin',
//
// ' /authentifier1': 'AuthenticatorController.Authentifier',
// ' /logout': 'AuthenticatorController.logout',
// ' /updateSelonRole': 'AuthenticatorController.updateSelonRole',
'/getPasswordByEmail': 'AuthenticatorController.getPasswordByEmail',
'POST /ligne/create': 'LigneController.createLigne',
'GET /intervention/print/:id': 'InterventionController.printPDF',
'GET /demandepiece/printDemandePiece/:id': 'DemandepieceController.printDemandePiece'
// 'POST /message/create': 'MessageController.create'
//
// '/demandepiece/create': 'DemandepieceController.createDemandedePiece',
// '/demandepiece/getAll': 'DemandepieceController.getAlldemandepiece',
// '/demandepiece/getById/:id': 'DemandepieceController.getdemandepieceById',
// '/demandepiece/update': 'DemandepieceController.updatedemandepiece',
// '/demandepiece/delete/:id': 'DemandepieceController.deleteDemandepiece',
// '/demandepiece/getGroupByIntervention': 'DemandepieceController.getDemandeGroupbyIn',
// '/demandepiece/getByIntervention/:id': 'DemandepieceController.getlistdemandebyintervention',
// //
// '/employee/create': 'EmployeeController.createEmployee',
// ' /employee/getAll': 'EmployeeController.getAllEmployee',
// ' /employee/:id': 'EmployeeController.getEmployeeById',
// ' /employee/update/:id': 'EmployeeController.updateEmployee',
// ' /employee/delete/:id': 'EmployeeController.deleteEmployee',
// '/employee/deleteNoPermitted/:id': 'EmployeeController.deleteEmployeeWithDemandeInterventionNoPermitted',


// // Endpoint pour la méthode upload du EquipementController
// ' /equipement/upload': 'EquipementController.upload',

// // Endpoint pour la méthode add du EquipementController
// '/equipement/add': 'EquipementController.add',

// // Endpoint pour la méthode getAllEquipement du EquipementController
// '/equipement/getAllEquipement': 'EquipementController.getAllEquipement',

// // Endpoint pour la méthode getEquipementById du EquipementController
// ' /equipement/getEquipementById/:id': 'EquipementController.getEquipementById',

// // Endpoint pour la méthode updateEquipement du EquipementController
// '/equipement/updateEquipement/:id': 'EquipementController.updateEquipement',

// // Endpoint pour la méthode deleteEquipement du EquipementController
// ' /equipement/deleteEquipement/:id': 'EquipementController.deleteEquipement',
// // endpoint pour créer un établissement
// '/etablissement/create': 'EtablissementController.createEtablissement',

// // endpoint pour récupérer tous les établissements
// '/etablissement': 'EtablissementController.getAllEtablissement',

// // endpoint pour récupérer un établissement par ID
// '/etablissement/:id': 'EtablissementController.getEtablissementById',

// // endpoint pour mettre à jour un établissement par ID
// '/etablissement/:id': 'EtablissementController.updateEtablissement',

// // endpoint pour supprimer un établissement par ID
// '/etablissement/:id': 'EtablissementController.deleteEtablissemen',

//


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


