const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // temps d'acquisition (équivalent à acquire)
  socketTimeoutMS: 10000, // temps d'inactivité (équivalent à idle)
  maxPoolSize: 5, // max connections dans le pool
  minPoolSize: 0, // min connections
  autoIndex: false, // équivalent à timestamps: false pour éviter la création automatique d'index
  retryWrites: true // MongoDB gère nativement certains retries
};

// Connexion
mongoose
  .connect(process.env.DB_URL, options)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Ici, on pourrait ajouter une logique de retry manuel si besoin
  });

module.exports = mongoose;
