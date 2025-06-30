<script lang="ts">
  import { Router, Route, Link } from "svelte-routing";
  import TodoListSelector from "./lib/components/TodoListSelector.svelte";
  import TodoDetail from "./lib/components/TodoDetail.svelte";
  import CompletedTodos from "./lib/components/CompletedTodos.svelte";
</script>

<Router>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <div class="container-fluid">
      <Link class="navbar-brand" to="/lists">Multi-List ToDo (Svelte)</Link>
    </div>
  </nav>

  <main class="container">
    <Route path="/lists/:listId/completed" let:params> <!-- corrected not this way <Route path="/lists/:listId/completed" component={CompletedTodos} /> -->
      <CompletedTodos listId={params.listId} />
    </Route>

    <Route path="/lists/:listId" let:params>
      <TodoDetail listId={params.listId} />
    </Route>

    <Route path="/lists">
      <TodoListSelector />
    </Route>
    <Route path="/">
      <TodoListSelector />
    </Route>
  </main>
</Router>