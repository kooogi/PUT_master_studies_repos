<script lang="ts">
  import { Link } from 'svelte-routing';
  import * as api from '../apiService';
  import type { Todo, TodoList } from '../../types';

  // Route parameter 'listId' will be passed as a prop
  export let listId: string | undefined = undefined;

  let completedTodos: Todo[] = [];
  let currentList: TodoList | null = null;
  let loading: boolean = true;
  let error: string | null = null;

  // Reactive statement: Fetch data when listId prop changes
  $: if (listId) {
    console.log("CompletedTodos: List ID prop changed to:", listId, "Fetching data...");
    fetchCompletedTodos(listId);
  } else {
    console.log("CompletedTodos: List ID prop is undefined.");
    currentList = null;
    completedTodos = [];
    loading = false;
  }

  async function fetchCompletedTodos(id: string) {
    if (!id || (loading && currentList && currentList._id === id)) return;

    try {
      loading = true;
      error = null;
      currentList = await api.getTodoListById(id);
      const allTodos = await api.getTodosForList(id);
      completedTodos = allTodos.filter(todo => todo.done);
    } catch (err) {
      console.error(`Failed to load completed todos for list ${id}`, err);
      error = "Failed to load completed items.";
      currentList = null;
      completedTodos = [];
    } finally {
      loading = false;
    }
  }

  async function handleMarkAsNotDone(todo: Todo) {
    if (!listId || !todo._id) return;
    try {
      await api.updateTodoInList(listId, todo._id, { done: false });
      // Remove from this list as it's no longer completed
      completedTodos = completedTodos.filter(t => t._id !== todo._id);
    } catch (err) {
      console.error("Failed to mark as not done", err);
      error = "Failed to update item. Please try again.";
    }
  }

  async function handleDeleteCompletedTodo(todoId: string) {
    if (!listId) return;
    if (window.confirm('Are you sure you want to permanently delete this completed task?')) {
      try {
        const allTodosAfterDelete = await api.deleteTodoFromList(listId, todoId);
        // Re-filter for completed tasks from the full list returned by the API
        completedTodos = allTodosAfterDelete.filter(todo => todo.done);
      } catch (err) {
        console.error("Failed to delete completed todo", err);
        error = "Failed to delete item. Please try again.";
      }
    }
  }

</script>

<div class="mt-4">
  <div class="mb-3">
    {#if listId}
      <Link to={`/lists/${listId}`} class="btn btn-sm btn-outline-secondary">
        « Back to Active Tasks
      </Link>
    {/if}
  </div>

  {#if loading && !currentList && listId}
    <p>Loading completed items for list: {listId}...</p>
  {:else if error}
    <p style="color: red;">Error: {error}</p>
  {:else if !currentList && listId}
    <p>List with ID '{listId}' not found or failed to load.</p>
  {:else if !listId}
    <p>No list selected to view completed tasks.</p>
  {:else if currentList}
    <div class="py-3 px-4 mb-4 bg-light rounded-3 text-center">
      <h1>
        {currentList.name} - Completed Tasks
        <span class="badge bg-success text-white ms-2">{completedTodos.length}</span>
      </h1>
    </div>

    <div class="row justify-content-center">
      <div class="col-sm-8 col-md-6">
        <ul class="list-group">
          {#if completedTodos.length === 0}
            <li class="list-group-item text-center">No tasks completed yet in this list.</li>
          {/if}
          {#each completedTodos as todo (todo._id)}
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span class="text-decoration-line-through text-muted">
                {todo.text}
              </span>
              <div>
                <button on:click={() => handleMarkAsNotDone(todo)} class="btn btn-sm btn-outline-warning me-2" title="Mark as not done">
                  Undo
                </button>
                <button on:click={() => handleDeleteCompletedTodo(todo._id!)} class="btn btn-sm btn-outline-danger" title="Delete permanently">
                  Delete
                </button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>