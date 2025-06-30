// src/app/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  // <--- ADD 'export' HERE
  _id?: string;
  text: string;
  done: boolean;
  listId?: string;
}

export interface TodoList {
  _id: string;
  name: string;
  createdAt?: Date;
}

export interface DeleteListResponse {
  message: string;
  deletedList: TodoList;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  getTodoListById(listId: string): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.todoListsApiUrl}/${listId}`);
  }
  // Base API URLs - adjust if your backend structure is different
  private todoListsApiUrl = '/api/todolists';

  constructor(private http: HttpClient) {}

  // --- ToDo List Methods ---
  getTodoLists(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(this.todoListsApiUrl);
  }

  createTodoList(name: string): Observable<TodoList> {
    // Assuming backend returns the created list
    return this.http.post<TodoList>(this.todoListsApiUrl, { name });
  }

  // --- ToDo Item Methods (now scoped to a listId) ---
  getTodosForList(listId: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoListsApiUrl}/${listId}/todos`);
  }

  addTodoToList(listId: string, todoText: string): Observable<Todo[]> {
    // Assuming backend returns updated list of todos
    return this.http.post<Todo[]>(`${this.todoListsApiUrl}/${listId}/todos`, {
      text: todoText,
    });
  }

  deleteTodoFromList(listId: string, todoId: string): Observable<Todo[]> {
    // Assuming backend returns updated list
    return this.http.delete<Todo[]>(
      `${this.todoListsApiUrl}/${listId}/todos/${todoId}`
    );
  }

  updateTodoInList(listId: string, todo: Todo): Observable<Todo> {
    // For marking as done
    // Your backend will need a PATCH or PUT endpoint for this
    // e.g., PATCH /api/todolists/:listId/todos/:todoId
    return this.http.patch<Todo>(
      `${this.todoListsApiUrl}/${listId}/todos/${todo._id}`,
      { done: todo.done }
    );
  }

  deleteTodoList(listId: string): Observable<DeleteListResponse> {
    // Or Observable<any> if you don't care about specific response structure
    return this.http.delete<DeleteListResponse>(
      `${this.todoListsApiUrl}/${listId}`
    );
  }
}
