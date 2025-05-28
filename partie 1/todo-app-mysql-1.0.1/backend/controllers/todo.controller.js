const TodoModel = require('../models/TodoModel');

const TodoController = {
  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const newTodo = await TodoModel.create({
        text: text,
        date: date,
        completed: false,
        user_id: user_id
      });
      return res.status(201).json(newTodo);
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.status(500).send();
    }
  },

  getAllTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todos = await TodoModel.find({ user_id: user_id }).sort({ date: 1 }).select('-user_id');
      if (todos.length > 0) {
        return res.status(200).json(todos);
      } else {
        return res.status(404).send();
      }
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.status(500).send();
    }
  },

  editTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const data = req.body;
      const todo = await TodoModel.findOne({ _id: todo_id, user_id: user_id });
      console.log(todo);
      if (todo) {
        todo.completed = data.completed !== undefined ? data.completed : todo.completed;
        todo.text = data.text !== undefined ? data.text : todo.text;
        todo.date = data.date !== undefined ? data.date : todo.date;
        await todo.save();
        return res.status(200).json(todo);
      } else {
        return res.status(404).send();
      }
    } catch (error) {
      console.error('UPDATE TODO: ', error);
      return res.status(500).send();
    }
  },

  deleteTodo: async (req, res) => {
    console.log(req.params.id);
    console.log(req.sub);
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;

      const todo = await TodoModel.findOneAndDelete({ _id: todo_id, user_id: user_id });

      console.log('test : ' + todo);

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      res.status(200).json({ _id: todo_id });
    } catch (error) {
      console.error('DELETE TODO:', error);
      res.status(500).json({ message: 'Error deleting todo' });
    }
  },
  getSearchTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const query = req.query.q;
      const todos = await TodoModel.find({
        user_id: user_id,
        $text: { $search: query }
      })
        .sort({ date: 1 })
        .select('-user_id');

      if (todos.length > 0) {
        return res.status(200).json(todos);
      } else {
        return res.status(404).send();
      }
    } catch (error) {
      console.error('SEARCH TODO: ', error);
      return res.status(500).send();
    }
  }
};

module.exports = TodoController;
