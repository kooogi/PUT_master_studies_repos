import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import * as api from "../apiService";
import type { Todo, TodoList } from "../types";

function CompletedTodos() {
  const { listId } = useParams<{ listId: string }>();
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [currentList, setCurrentList] = useState<TodoList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) return;

    const fetchCompleted = async () => {
      try {
        setLoading(true);
        setError(null);
        const listDetails = await api.getTodoListById(listId);
        setCurrentList(listDetails);

        const allTodos = await api.getTodosForList(listId);
        setCompletedTodos(allTodos.filter((todo) => todo.done));
      } catch (err) {
        console.error("Failed to load completed todos", err);
        setError("Failed to load completed items.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, [listId]);

  const handleMarkAsNotDone = async (todo: Todo) => {
    if (!listId || !todo._id) return;
    try {
      await api.updateTodoInList(listId, todo._id, { done: false });
      setCompletedTodos((prevTodos) =>
        prevTodos.filter((t) => t._id !== todo._id)
      );
    } catch (err) {
      console.error("Failed to mark as not done", err);
      setError("Failed to update item. Please try again.");
    }
  };

  const handleDeleteCompletedTodo = async (todoId: string) => {
    if (!listId) return;
    if (
      window.confirm(
        "Are you sure you want to permanently delete this completed task?"
      )
    ) {
      try {
        // Backend returns ALL todos after delete, so we re-filter for completed ones
        const allTodosAfterDelete = await api.deleteTodoFromList(
          listId,
          todoId
        );
        setCompletedTodos(allTodosAfterDelete.filter((todo) => todo.done));
      } catch (err) {
        console.error("Failed to delete completed todo", err);
        setError("Failed to delete item. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="container mt-4">
        <p>Loading completed items...</p>
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
      <div className="mb-3">
        <RouterLink
          to={`/lists/${listId}`}
          className="btn btn-sm btn-outline-secondary"
        >
          « Back to Active Tasks
        </RouterLink>
      </div>

      <div className="py-3 px-4 mb-4 bg-light rounded-3 text-center">
        <h1>
          {currentList.name} - Completed Tasks
          <span className="badge bg-success text-white ms-2">
            {completedTodos.length}
          </span>
        </h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6">
          <ul className="list-group">
            {completedTodos.length === 0 && (
              <li className="list-group-item text-center">
                No tasks completed yet.
              </li>
            )}
            {completedTodos.map((todo) => (
              <li
                key={todo._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="text-decoration-line-through text-muted">
                  {todo.text}
                </span>
                <div>
                  <button
                    onClick={() => handleMarkAsNotDone(todo)}
                    className="btn btn-sm btn-outline-warning me-2"
                    title="Mark as not done"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => handleDeleteCompletedTodo(todo._id!)}
                    className="btn btn-sm btn-outline-danger"
                    title="Delete permanently"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CompletedTodos;
