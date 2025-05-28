const router = require('express').Router();
const { authenticateToken } = require('../middlewares');
const { createTodo, getAllTodo, getSearchTodo, editTodo, deleteTodo } =
  require('../controllers').TodoController;

const { cacheMiddleware, invalidateCache } = require('../middlewares/redisCache');


// Handle the API request
router.post('/', authenticateToken, createTodo);
router.get('/', cacheMiddleware, invalidateCache, authenticateToken, getAllTodo);
router.get('/search', cacheMiddleware, invalidateCache, authenticateToken, getSearchTodo);
router.patch('/:id', authenticateToken, editTodo);
router.delete('/:id', authenticateToken, deleteTodo);

module.exports = router;
