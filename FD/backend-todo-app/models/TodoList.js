const mongoose = require("mongoose");

const TodoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "List name is required"],
    trim: true,
    unique: true, // Optional: if you want list names to be unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TodoList", TodoListSchema);
