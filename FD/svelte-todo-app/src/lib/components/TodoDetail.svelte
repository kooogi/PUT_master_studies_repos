<script lang="ts">
  import { Link } from 'svelte-routing';
  import * as api from '../apiService';
  import type { Todo, TodoList } from '../../types';

  // Route parameters are passed as props by svelte-routing
  export let listId: string | undefined = undefined; // This will be populated by the router

  let activeTodos: Todo[] = [];
  let currentList: TodoList | null = null;
  let newTodoText: string = '';
  let loading: boolean = true;
  let error: string | null = null;

  async function fetchListDetailsAndTodos(id: string) {
    // Prevent re-fetching if already loading for the same ID (or if ID is undefined)
    if (!id || (loading && currentList && currentList._id === id)) return;

    try {
      loading = true;
      error = null;
      currentList = await api.getTodoListById(id);
      const allTodos = await api.getTodosForList(id);
      activeTodos = allTodos.filter(todo => !todo.done);
    } catch (err) {
      console.error(`Failed to load data for list ${id}`, err);
      error = "Failed to load data for this list.";
      currentList = null; // Reset on error
      activeTodos = [];   // Reset on error
    } finally {
      loading = false;
    }
  }

  // This reactive statement will run whenever 'listId' (the prop) changes.
  // Svelte's reactivity handles this automatically when a prop updates.
  $: if (listId) {
    console.log("List ID prop changed to:", listId, "Fetching data...");
    fetchListDetailsAndTodos(listId);
  } else {
    // Handle case where listId is not provided (e.g., direct navigation to a bad route or initial state)
    console.log("List ID prop is undefined.");
    currentList = null;
    activeTodos = [];
    loading = false; // Not loading if no ID
    error = "No list selected.";
  }


  async function handleAddTodo() {
    if (!newTodoText.trim() || !listId) return;
    try {
      const allTodosAfterAdd = await api.addTodoToList(listId, newTodoText);
      activeTodos = allTodosAfterAdd.filter(todo => !todo.done);
      newTodoText = '';
    } catch (err) {
      console.error("Failed to add todo", err);
      error = "Failed to add item. Please try again.";
    }
  }

  async function handleMarkAsDone(todo: Todo) {
    if (!listId || !todo._id) return;
    try {
      await api.updateTodoInList(listId, todo._id, { done: true });
      activeTodos = activeTodos.filter(t => t._id !== todo._id);
    } catch (err) {
      console.error("Failed to mark as done", err);
      error = "Failed to update item. Please try again.";
    }
  }

  async function handleDeleteActiveTodo(todoId: string) {
    if (!listId) return;
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        const allTodosAfterDelete = await api.deleteTodoFromList(listId, todoId);
        activeTodos = allTodosAfterDelete.filter(todo => !todo.done);
      } catch (err) {
        console.error("Failed to delete active todo", err);
        error = "Failed to delete item. Please try again.";
      }
    }
  }
</script>

<!-- HTML Template remains the same, using 'listId' directly as it's a prop -->
<div class="mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <Link to="/lists" class="btn btn-sm btn-outline-secondary">« Back to Lists</Link>
    {#if listId}
      <Link to={`/lists/${listId}/completed`} class="btn btn-sm btn-info">
        View Completed Tasks
      </Link>
    {/if}
  </div>

  {#if loading && !currentList && listId } <!-- Show loading only if listId is present and we haven't loaded currentList -->
    <p>Loading todo items for list: {listId}...</p>
  {:else if error}
    <p style="color: red;">Error: {error}</p>
  {:else if !currentList && listId}
    <p>List with ID '{listId}' not found or failed to load.</p>
  {:else if !listId}
    <p>No list selected.</p>
  {:else if currentList}
    <div class="py-3 px-4 mb-4 bg-light rounded-3 text-center">
      <h1>
        {currentList.name} - Active Tasks
        <span class="badge bg-primary text-white ms-2">{activeTodos.length}</span>
      </h1>
    </div>

    <form on:submit|preventDefault={handleAddTodo} class="row justify-content-center mb-4">
      <div class="col-sm-10 col-md-8 text-center">
          <div class="input-group">
              <input type="text" class="form-control form-control-lg text-center"
                      placeholder="What needs to be done?" bind:value={newTodoText} name="newTodoText"/>
              <button type="submit" class="btn btn-primary btn-lg">Add Item</button>
          </div>
      </div>
    </form>

    <div class="row justify-content-center">
      <div class="col-sm-8 col-md-6">
        <div class="list-group">
          {#if activeTodos.length === 0}
            <p class="list-group-item text-center">No active tasks!</p>
          {/if}
          {#each activeTodos as todo (todo._id)}
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  on:change={() => handleMarkAsDone(todo)}
                  id={`todo-${todo._id}`}
                  checked={false}
                />
                <label class="form-check-label" for={`todo-${todo._id}`}>
                  {todo.text}
                </label>
              </div>
              <button on:click={() => handleDeleteActiveTodo(todo._id!)} class="btn btn-sm btn-outline-danger">
                Delete
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>