// MODULES
const multer = require('multer');
// FIN MODULES

// DICTIONNAIRE TYPE MIME
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};
// FIN DICTIONNAIRE

// FONCTION STORAGE
const storage = multer.diskStorage({ // Configure multer
  destination: (req, file, callback) => { // Indique où enregistrer les fichiers
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Indique le nom du fichier
    const name = file.originalname.split(' ').join('_'); // Retire les potentiels espaces
    const extension = MIME_TYPES[file.mimetype]; // Défini le type
    callback(null, name + Date.now() + '.' + extension); // Génère le nom unique
  }
});
// FIN FONCTION

module.exports = multer({storage: storage}).single('image');