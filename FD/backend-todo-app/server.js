const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const TodoList = require("./models/TodoList");
const TodoItem = require("./models/TodoItem");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = "mongodb://localhost:27017/backend";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully to", MONGO_URI))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- API Routes ---

// == TodoList Routes ==

// GET /api/todolists: Get all ToDo lists.
app.get("/api/todolists", async (req, res) => {
  try {
    const lists = await TodoList.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(lists);
  } catch (err) {
    console.error("Error fetching todolists:", err);
    res
      .status(500)
      .json({ message: "Server error fetching lists", error: err.message });
  }
});

// POST /api/todolists: Create a new ToDo list (requires a name).
app.post("/api/todolists", async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "List name is required" });
  }
  try {
    // Check if list with the same name already exists
    const existingList = await TodoList.findOne({ name: name.trim() });
    if (existingList) {
      return res
        .status(400)
        .json({ message: "A list with this name already exists" });
    }

    const newList = new TodoList({ name: name.trim() });
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (err) {
    console.error("Error creating todolist:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "A list with this name already exists (from DB constraint)",
      });
    }
    res
      .status(500)
      .json({ message: "Server error creating list", error: err.message });
  }
});

// DELETE /api/todolists/:listId: Delete an entire ToDo list and all its tasks.
app.delete("/api/todolists/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    // Validate listId format
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid List ID format" });
    }

    // First, delete all TodoItems associated with this list
    await TodoItem.deleteMany({ listId: listId });

    // Then, delete the TodoList itself
    const deletedList = await TodoList.findByIdAndDelete(listId);

    if (!deletedList) {
      return res.status(404).json({ message: "ToDo List not found" });
    }
    res.json({
      message: "ToDo List and all its items deleted successfully",
      deletedList,
    });
  } catch (err) {
    console.error(`Error deleting todolist ${listId}:`, err);
    res
      .status(500)
      .json({ message: "Server error deleting list", error: err.message });
  }
});

// == TodoItem Routes (scoped by listId) ==

// GET /api/todolists/:listId/todos: Get all ToDo items for a specific list.
app.get("/api/todolists/:listId/todos", async (req, res) => {
  const { listId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid List ID format" });
    }
    // Check if the list itself exists
    const parentList = await TodoList.findById(listId);
    if (!parentList) {
      return res.status(404).json({ message: "Parent ToDo List not found" });
    }

    const items = await TodoItem.find({ listId: listId }).sort({
      createdAt: 1,
    }); // Sort by oldest first, or your preference
    res.json(items);
  } catch (err) {
    console.error(`Error fetching todos for list ${listId}:`, err);
    res.status(500).json({
      message: "Server error fetching todo items",
      error: err.message,
    });
  }
});

// POST /api/todolists/:listId/todos: Create a new ToDo item within a specific list.
app.post("/api/todolists/:listId/todos", async (req, res) => {
  const { listId } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Todo item text is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    return res.status(400).json({ message: "Invalid List ID format" });
  }

  try {
    const parentList = await TodoList.findById(listId);
    if (!parentList) {
      return res
        .status(404)
        .json({ message: "Parent ToDo List not found, cannot add item" });
    }

    const newItem = new TodoItem({
      text: text.trim(),
      listId: listId,
    });
    await newItem.save();

    // Consistent with previous API: return all items for the list after adding
    const updatedItems = await TodoItem.find({ listId: listId }).sort({
      createdAt: 1,
    });
    res.status(201).json(updatedItems);
  } catch (err) {
    console.error(`Error creating todo item for list ${listId}:`, err);
    res
      .status(500)
      .json({ message: "Server error creating todo item", error: err.message });
  }
});

// PATCH /api/todolists/:listId/todos/:todoId: Update a specific ToDo item.
app.patch("/api/todolists/:listId/todos/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;
  const { text, done } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(listId) ||
    !mongoose.Types.ObjectId.isValid(todoId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Construct update object - only include fields that are present in the request
  const updateFields = {};
  if (typeof text === "string") updateFields.text = text.trim();
  if (typeof done === "boolean") updateFields.done = done;

  if (Object.keys(updateFields).length === 0) {
    return res
      .status(400)
      .json({ message: "No update fields provided (text or done)" });
  }

  try {
    const updatedItem = await TodoItem.findOneAndUpdate(
      { _id: todoId, listId: listId }, // Ensure item belongs to the specified list
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated doc, run schema validators
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Todo item not found in this list or list does not exist",
      });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(`Error updating todo item ${todoId} in list ${listId}:`, err);
    res
      .status(500)
      .json({ message: "Server error updating todo item", error: err.message });
  }
});

// DELETE /api/todolists/:listId/todos/:todoId: Delete a specific ToDo item.
app.delete("/api/todolists/:listId/todos/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(listId) ||
    !mongoose.Types.ObjectId.isValid(todoId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedItem = await TodoItem.findOneAndDelete({
      _id: todoId,
      listId: listId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Todo item not found in this list or list does not exist",
      });
    }

    // Consistent with previous API: return all remaining items for the list
    const updatedItems = await TodoItem.find({ listId: listId }).sort({
      createdAt: 1,
    });
    res.json(updatedItems);
  } catch (err) {
    console.error(
      `Error deleting todo item ${todoId} from list ${listId}:`,
      err
    );
    res
      .status(500)
      .json({ message: "Server error deleting todo item", error: err.message });
  }
});

// GET /api/todolists/:listId: Get a single ToDo list by its ID.
app.get("/api/todolists/:listId", async (req, res) => {
  const { listId } = req.params;
  try {
    // Validate listId format
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid List ID format" });
    }

    const todoList = await TodoList.findById(listId);

    if (!todoList) {
      return res.status(404).json({ message: "ToDo List not found" });
    }
    res.json(todoList);
  } catch (err) {
    console.error(`Error fetching todolist with ID ${listId}:`, err);
    res.status(500).json({
      message: "Server error fetching list details",
      error: err.message,
    });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Multi-list ToDo API Server running on http://localhost:${PORT}`);
});
