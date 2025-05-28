const router = require('express').Router();
const { authenticateToken } = require('../middlewares');
const { createUser, getUser, editUser, deleteCurrentUser } =
  require('../controllers').UserController;

const { cacheMiddleware, invalidateCache } = require('../middlewares/redisCache');
// Handle the API request
router.post('/', createUser);
router.get('/', cacheMiddleware, invalidateCache, authenticateToken, getUser);
router.patch('/', authenticateToken, editUser);
router.delete('/', authenticateToken, deleteCurrentUser);

module.exports = router;
