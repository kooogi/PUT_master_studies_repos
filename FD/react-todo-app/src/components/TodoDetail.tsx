import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import * as api from "../apiService";
import type { Todo, TodoList } from "../types";

function TodoDetail() {
  const { listId } = useParams<{ listId: string }>();
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [currentList, setCurrentList] = useState<TodoList | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) return;

    const fetchListDetailsAndTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch list details (for name)
        const listDetails = await api.getTodoListById(listId);
        setCurrentList(listDetails);

        // Fetch todos and filter for active
        const allTodos = await api.getTodosForList(listId);
        setActiveTodos(allTodos.filter((todo) => !todo.done));
      } catch (err) {
        console.error("Failed to load list details or todos", err);
        setError("Failed to load data for this list.");
      } finally {
        setLoading(false);
      }
    };

    fetchListDetailsAndTodos();
  }, [listId]); // Re-run if listId changes

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoText.trim() || !listId) return;
    try {
      const allTodosAfterAdd = await api.addTodoToList(listId, newTodoText);
      setActiveTodos(allTodosAfterAdd.filter((todo) => !todo.done));
      setNewTodoText("");
    } catch (err) {
      console.error("Failed to add todo", err);
      setError("Failed to add item. Please try again.");
    }
  };

  const handleMarkAsDone = async (todo: Todo) => {
    if (!listId || !todo._id) return;
    try {
      await api.updateTodoInList(listId, todo._id, { done: true });
      setActiveTodos((prevTodos) =>
        prevTodos.filter((t) => t._id !== todo._id)
      );
    } catch (err) {
      console.error("Failed to mark as done", err);
      setError("Failed to update item. Please try again.");
    }
  };

  const handleDeleteActiveTodo = async (todoId: string) => {
    if (!listId) return;
    if (
      window.confirm("Are you sure you want to permanently delete this task?")
    ) {
      try {
        const allTodosAfterDelete = await api.deleteTodoFromList(
          listId,
          todoId
        );
        setActiveTodos(allTodosAfterDelete.filter((todo) => !todo.done));
      } catch (err) {
        console.error("Failed to delete active todo", err);
        setError("Failed to delete item. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="container mt-4">
        <p>Loading todo items...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  if (!currentList)
    return (
      <div className="container mt-4">
        <p>List not found.</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <RouterLink to="/lists" className="btn btn-sm btn-outline-secondary">
          « Back to Lists
        </RouterLink>
        <RouterLink
          to={`/lists/${listId}/completed`}
          className="btn btn-sm btn-info"
        >
          View Completed Tasks
        </RouterLink>
      </div>

      <div className="py-3 px-4 mb-4 bg-light rounded-3 text-center">
        <h1>
          {currentList.name} - Active Tasks
          <span className="badge bg-primary text-white ms-2">
            {activeTodos.length}
          </span>
        </h1>
      </div>

      <form
        onSubmit={handleAddTodo}
        className="row justify-content-center mb-4"
      >
        <div className="col-sm-10 col-md-8 text-center">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg text-center"
              placeholder="What needs to be done?"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              name="newTodoText"
            />
            <button type="submit" className="btn btn-primary btn-lg">
              Add Item
            </button>
          </div>
        </div>
      </form>

      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6">
          <div className="list-group">
            {activeTodos.length === 0 && (
              <p className="list-group-item text-center">No active tasks!</p>
            )}
            {activeTodos.map((todo) => (
              <div
                key={todo._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    onChange={() => handleMarkAsDone(todo)}
                    id={`todo-${todo._id}`}
                    checked={false}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`todo-${todo._id}`}
                  >
                    {todo.text}
                  </label>
                </div>
                <button
                  onClick={() => handleDeleteActiveTodo(todo._id!)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;
