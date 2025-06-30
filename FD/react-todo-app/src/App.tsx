import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import TodoListSelector from "./components/TodoListSelector";
import TodoDetail from "./components/TodoDetail";
import CompletedTodos from "./components/CompletedTodos";

function AppLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<TodoListSelector />} />{" "}
        <Route path="lists" element={<TodoListSelector />} />
        <Route path="lists/:listId" element={<TodoDetail />} />
        <Route path="lists/:listId/completed" element={<CompletedTodos />} />
      </Route>
    </Routes>
  );
}

export default App;
