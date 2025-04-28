const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB utilise ObjectId pour référencer un autre document
      ref: 'User', // le modèle que tu veux référencer
      required: true
    }
  },
  {
    timestamps: false // pour respecter ton "define: { timestamps: false }"
  }
);

// Ajouter un index FULLTEXT sur le champ "text"
todoSchema.index({ text: 'text' });

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;
