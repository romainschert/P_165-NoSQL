const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // plutôt que process.loadEnvFile qui n'existe pas officiellement

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

const router = require('./routes');

// Connexion MongoDB
const initApp = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ La connexion à MongoDB a été établie avec succès.');

    // Serveur des fichiers du frontend
    app.use(express.static(path.join(__dirname, '../dist')));

    app.use(express.json());
    app.use(cookieParser());

    // Routes API
    app.use(router);

    // Serveur de l'index.html du frontend
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../index.html'));
    });

    // Démarrage du serveur
    app.listen(port, () => {
      console.info(`🚀🚀 Le serveur est démarré sur le port ${port} en mode ${env} 🚀🚀`);
    });
  } catch (error) {
    console.error('❌ Impossible de se connecter à MongoDB', error);
    process.exit(1);
  }
};

initApp();
