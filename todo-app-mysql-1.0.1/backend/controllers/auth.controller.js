const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const UserModel = require('../models').UserModel;
const JWT_SECRET = require('../config/keys').JWT_SECRET;

// remove password from user object
const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.get({ plain: true });
  return cleanedUser;
};

const AuthController = {
  loginUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email.toLowerCase() });

      if (!user) {
        return res.status(404).json({
          message: "Ce compte n'existe pas !"
        });
      }

      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          message: 'Mauvais email ou mot de passe!'
        });
      }

      const cleanedUser = user;
      const token = jsonwebtoken.sign({}, JWT_SECRET, {
        subject: user._id.toString(),
        expiresIn: 60 * 60 * 24 * 30 * 6, // 6 mois
        algorithm: 'RS256'
      });

      return res.status(200).json({ user: cleanedUser, token: token });
    } catch (error) {
      console.error('LOGIN USER: ', error);
      return res.status(400).json(null);
    }
  }
};

module.exports = AuthController;
