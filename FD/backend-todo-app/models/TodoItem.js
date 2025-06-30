const mongoose = require("mongoose");

const TodoItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Todo text is required"],
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TodoList", // Reference to the TodoList model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TodoItem", TodoItemSchema);
