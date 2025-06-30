import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Todo, TodoService, TodoList } from '../todo.service';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss'],
})
export class TodoDetailComponent implements OnInit {
  activeTodos: Todo[] = [];
  newTodoText: string = '';
  currentListId: string | null = null;
  currentList: TodoList | null = null;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentListId = params.get('listId');
      if (this.currentListId) {
        this.loadListDetails(this.currentListId); // Fetch list name/details
        this.loadActiveTodosForList(this.currentListId); // Fetch only active todos
      }
    });
  }

  loadListDetails(listId: string): void {
    this.todoService.getTodoListById(listId).subscribe(
      (listData) => {
        this.currentList = listData;
      },
      (error) => {
        console.error(`Error loading list details for ${listId}:`, error);
        this.currentList = null;
      }
    );
  }

  // Fetches all todos for the list and then filters for active ones
  loadActiveTodosForList(listId: string): void {
    this.todoService.getTodosForList(listId).subscribe(
      (allTodos) => {
        // Filter for todos that are NOT done
        this.activeTodos = allTodos.filter((todo) => !todo.done);
        console.log('Active todos loaded:', this.activeTodos);
      },
      (error) => {
        console.error(`Error loading ToDos for list ${listId}:`, error);
        this.activeTodos = [];
      }
    );
  }

  onAddTodo(): void {
    if (!this.newTodoText.trim() || !this.currentListId) return;
    this.todoService
      .addTodoToList(this.currentListId, this.newTodoText)
      .subscribe(
        (allTodosAfterAdd) => {
          // Backend returns all todos. We re-filter to update activeTodos.
          this.activeTodos = allTodosAfterAdd.filter((todo) => !todo.done);
          this.newTodoText = '';
        },
        (error) => {
          console.error('Error adding todo:', error);
        }
      );
  }

  // This method now marks a task as done (moves it)
  onMarkAsDone(todo: Todo): void {
    if (!this.currentListId || !todo._id) return;

    const updatedTodoData: Todo = { ...todo, done: true }; // Set done to true

    this.todoService
      .updateTodoInList(this.currentListId, updatedTodoData)
      .subscribe(
        (savedTodo) => {
          console.log('Todo marked as done:', savedTodo);
          // Remove from the local activeTodos list as it's no longer active
          this.activeTodos = this.activeTodos.filter(
            (t) => t._id !== savedTodo._id
          );
        },
        (error) => {
          console.error('Error marking todo as done:', error);
          // Potentially revert UI if an optimistic update was made, or show error
          alert('Failed to mark task as completed. Please try again.');
        }
      );
  }

  // For deleting a task directly from the active list
  onDeleteActiveTodo(todoId: string | undefined): void {
    if (!todoId || !this.currentListId) return;

    // Add a confirmation dialog
    if (confirm('Are you sure you want to permanently delete this task?')) {
      this.todoService.deleteTodoFromList(this.currentListId, todoId).subscribe(
        (allTodosAfterDelete) => {
          // Backend returns all todos. Re-filter for active ones.
          this.activeTodos = allTodosAfterDelete.filter((todo) => !todo.done);
        },
        (error) => {
          console.error('Error deleting active todo:', error);
          alert('Failed to delete task. Please try again.');
        }
      );
    }
  }
}
