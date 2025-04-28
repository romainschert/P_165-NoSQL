const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // pour forcer l'email en minuscule
      validate: {
        validator: function (v) {
          // Vérifie que c'est bien une adresse email
          return;
        },
        message: (props) => `${props.value} n'est pas une adresse email valide !`
      }
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    zip: {
      type: Number
    },
    location: {
      type: String
    }
  },
  {
    timestamps: false // pour rester fidèle à ton define { timestamps: false }
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
