// MODULES
const mysql = require('mysql');
const env = require('./environment'); // Récupère les variables d'environnement
// FIN MODULES

// CONNEXION BASE DE DONNEE
exports.connection = mysql.createPool({
    host     : 'localhost',
    user     : `${env.dbId}`,
    password : `${env.dbPW}`,
    database : 'groupomania',
    timezone : 'local',
    charset : 'utf8mb4'
  });
// FIN CONNEXION 