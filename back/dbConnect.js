// MODULES
const mysql = require('mysql');
const env = require('./environment');
// FIN MODULES

// CONNEXION BASE DE DONNEE
exports.connection = mysql.createPool({
    host     : 'localhost',
    user     : `${env.dbId}`,
    password : `${env.dbPW}`,
    database : 'groupomania'
  });
// FIN CONNEXION 