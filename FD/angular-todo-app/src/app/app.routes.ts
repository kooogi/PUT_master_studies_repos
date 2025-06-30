// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TodoListSelectorComponent } from './todo-list-selector/todo-list-selector.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { CompletedTodosComponent } from './completed-todos/completed-todos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  {
    path: 'lists',
    component: TodoListSelectorComponent,
    title: 'ToDo Lists',
  },
  {
    path: 'lists/:listId',
    component: TodoDetailComponent,
    title: 'Active ToDos',
  },
  {
    path: 'lists/:listId/completed',
    component: CompletedTodosComponent,
    title: 'Completed ToDos',
  },
];
