import axios from "axios";
import type { Todo, TodoList, DeleteListResponse } from "./types";

const API_BASE_URL = "/api";

// --- ToDo List Methods ---
export const getTodoLists = async (): Promise<TodoList[]> => {
  const response = await axios.get<TodoList[]>(`${API_BASE_URL}/todolists`);
  return response.data;
};

export const createTodoList = async (name: string): Promise<TodoList> => {
  const response = await axios.post<TodoList>(`${API_BASE_URL}/todolists`, {
    name,
  });
  return response.data;
};

export const getTodoListById = async (listId: string): Promise<TodoList> => {
  const response = await axios.get<TodoList>(
    `${API_BASE_URL}/todolists/${listId}`
  );
  return response.data;
};

export const deleteTodoList = async (
  listId: string
): Promise<DeleteListResponse> => {
  const response = await axios.delete<DeleteListResponse>(
    `${API_BASE_URL}/todolists/${listId}`
  );
  return response.data;
};

// --- ToDo Item Methods ---
export const getTodosForList = async (listId: string): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>(
    `${API_BASE_URL}/todolists/${listId}/todos`
  );
  return response.data;
};

export const addTodoToList = async (
  listId: string,
  todoText: string
): Promise<Todo[]> => {
  const response = await axios.post<Todo[]>(
    `${API_BASE_URL}/todolists/${listId}/todos`,
    { text: todoText }
  );
  return response.data;
};

export const updateTodoInList = async (
  listId: string,
  todoId: string,
  updates: Partial<Todo>
): Promise<Todo> => {
  // 'updates' will be like { done: true } or { text: "new text", done: false }
  const response = await axios.patch<Todo>(
    `${API_BASE_URL}/todolists/${listId}/todos/${todoId}`,
    updates
  );
  return response.data;
};

export const deleteTodoFromList = async (
  listId: string,
  todoId: string
): Promise<Todo[]> => {
  const response = await axios.delete<Todo[]>(
    `${API_BASE_URL}/todolists/${listId}/todos/${todoId}`
  );
  return response.data;
};
