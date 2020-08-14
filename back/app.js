// MODULES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const env = require('./environment');
// FIN MODULES

// CONNEXION BASE DE DONNEE
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : `${env.dbId}`,
    password : `${env.dbPW}`,
  });
   
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
// FIN CONNEXION 

// PARAMETRAGE DES HEADERS
app.use((req, res, next) => { // Evite les erreurs CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// FIN PARAMETRAGE

// BODYPARSER
app.use(bodyParser.json()); // Rend le corps de la requête exploitable facilement
// FIN BODYPARSER

app.use((req, res, next) => {
    res.end('serveur OP');
})

module.exports = app;