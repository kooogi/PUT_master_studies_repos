<script lang="ts">
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import * as api from '../apiService';
  import type { TodoList } from '../../types';

  let todoLists: TodoList[] = [];
  let newListName: string = '';
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      error = null;
      todoLists = await api.getTodoLists();
    } catch (err) {
      console.error("Failed to fetch todo lists", err);
      error = "Failed to load lists. Please try again.";
    } finally {
      loading = false;
    }
  });

  async function handleCreateList() {
    if (!newListName.trim()) return;
    try {
      const newList = await api.createTodoList(newListName);
      todoLists = [...todoLists, newList]; // Svelte reactivity: assign to trigger update
      newListName = '';
    } catch (err) {
      console.error("Failed to create todo list", err);
      error = "Failed to create list. Please try again.";
    }
  }

  async function handleDeleteList(listId: string, listName: string) {
    if (window.confirm(`Are you sure you want to delete the list "${listName}" and all its items?`)) {
      try {
        await api.deleteTodoList(listId);
        todoLists = todoLists.filter(list => list._id !== listId);
      } catch (err) {
        console.error(`Failed to delete list ${listId}`, err);
        error = "Failed to delete list. Please try again.";
      }
    }
  }
</script>

<div class="mt-4">
  <h2>Select or Create a ToDo List</h2>

  <form on:submit|preventDefault={handleCreateList} class="mb-4">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        placeholder="New list name"
        bind:value={newListName}
        required
      />
      <button type="submit" class="btn btn-success">Create List</button>
    </div>
  </form>

  {#if loading}
    <p>Loading lists...</p>
  {:else if error}
    <p style="color: red;">Error: {error}</p>
  {:else if todoLists.length === 0}
    <p class="list-group-item">No ToDo lists found. Create one!</p>
  {:else}
    <div class="list-group">
      {#each todoLists as list (list._id)}
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <Link to={`/lists/${list._id}`} class="flex-grow-1 text-decoration-none text-dark">
            {list.name}
          </Link>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger ms-2"
            on:click={() => handleDeleteList(list._id!, list.name)}
            title="Delete list {list.name}"
          >
            Delete
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
