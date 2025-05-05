const bcrypt = require('bcrypt');
const UserModel = require('../models').UserModel;

const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.get({ plain: true });
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          message: 'Un compte avec cet email existe déjà !'
        });
      }
      console.log(existingUser);
      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = await UserModel.create({
        email: email.toLowerCase(),
        password: hashedPassword
      });
      console.log(newUser);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('ADD USER ERROR:', error);
      return res.status(500).json({
        message: 'Une erreur est survenue lors de la création du compte.'
      });
    }
  },

  getUser: async (req, res) => {
    const user_id = req.sub;

    try {
      const result = await UserModel.findById(user_id).select('-_id -password');

      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('GET USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  editUser: async (req, res) => {
    const user_id = req.sub;
    const data = req.body;

    try {
      const user = await UserModel.findById(user_id);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      user.name = data.name || null;
      user.address = data.address || null;
      user.zip = data.zip || null;
      user.location = data.location || null;

      const result = await user.save();
      return res.status(200).json(result);
    } catch (error) {
      console.error('UPDATE USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  deleteCurrentUser: async (req, res) => {
    const user_id = req.sub;

    try {
      const result = await UserModel.findByIdAndDelete(user_id);

      if (!result) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error('DELETE USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = UserController;
