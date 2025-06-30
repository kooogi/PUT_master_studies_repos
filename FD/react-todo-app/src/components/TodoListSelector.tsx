import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../apiService";
import type { TodoList } from "../types";

function TodoListSelector() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);
        const lists = await api.getTodoLists();
        setTodoLists(lists);
      } catch (err) {
        console.error("Failed to fetch todo lists", err);
        setError("Failed to load lists. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleCreateList = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newListName.trim()) return;
    try {
      const newList = await api.createTodoList(newListName);
      setTodoLists((prevLists) => [...prevLists, newList]);
      setNewListName("");
    } catch (err) {
      console.error("Failed to create todo list", err);
      setError("Failed to create list. Please try again.");
    }
  };

  const handleDeleteList = async (listId: string, listName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the list "${listName}" and all its items?`
      )
    ) {
      try {
        await api.deleteTodoList(listId);
        setTodoLists((prevLists) =>
          prevLists.filter((list) => list._id !== listId)
        );
      } catch (err) {
        console.error(`Failed to delete list ${listId}`, err);
        setError("Failed to delete list. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="container mt-4">
        <p>Loading lists...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2>Select or Create a ToDo List</h2>

      <form onSubmit={handleCreateList} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success">
            Create List
          </button>
        </div>
      </form>

      <div className="list-group">
        {todoLists.length === 0 && !loading && (
          <p className="list-group-item">No ToDo lists found. Create one!</p>
        )}
        {todoLists.map((list) => (
          <div
            key={list._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link
              to={`/lists/${list._id}`}
              className="flex-grow-1 text-decoration-none text-dark"
            >
              {list.name}
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-2" // Added ms-2 for spacing
              onClick={() => handleDeleteList(list._id!, list.name)}
              title={`Delete list ${list.name}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoListSelector;
