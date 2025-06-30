import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Todo, TodoService, TodoList } from '../todo.service';

@Component({
  selector: 'app-completed-todos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './completed-todos.component.html',
  styleUrls: ['./completed-todos.component.scss'],
})
export class CompletedTodosComponent implements OnInit {
  completedTodos: Todo[] = [];
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
        this.loadListDetails(this.currentListId);
        this.loadCompletedTodos(this.currentListId);
      }
    });
  }

  loadListDetails(listId: string): void {
    this.todoService.getTodoListById(listId).subscribe(
      (listData) => {
        this.currentList = listData;
      },
      (error) => {
        console.error(`Error list details for ${listId}:`, error);
        this.currentList = null;
      }
    );
  }

  loadCompletedTodos(listId: string): void {
    this.todoService.getTodosForList(listId).subscribe(
      (allTodos) => {
        this.completedTodos = allTodos.filter((todo) => todo.done); // Filter for completed todos
      },
      (error) => {
        console.error(
          `Error loading completed ToDos for list ${listId}:`,
          error
        );
        this.completedTodos = [];
      }
    );
  }

  // This method DELETES a task PERMANENTLY from the completed list
  onDeleteCompletedTodo(todoId: string | undefined): void {
    if (!todoId || !this.currentListId) return;
    if (
      confirm(
        'Are you sure you want to permanently delete this completed task?'
      )
    ) {
      this.todoService.deleteTodoFromList(this.currentListId, todoId).subscribe(
        () => {
          // Backend returns updated list of ALL todos, or just success
          // Reload completed todos
          this.loadCompletedTodos(this.currentListId!);
        },
        (error) => {
          console.error('Error deleting completed todo:', error);
          alert('Failed to delete task. Please try again.');
        }
      );
    }
  }

  // Method to mark a completed task as NOT done (move back to active)
  onMarkAsNotDone(todo: Todo): void {
    if (!this.currentListId || !todo._id) return;
    const updatedTodoData: Todo = { ...todo, done: false };

    this.todoService
      .updateTodoInList(this.currentListId, updatedTodoData)
      .subscribe(
        (savedTodo) => {
          console.log('Todo marked as not done:', savedTodo);
          this.completedTodos = this.completedTodos.filter(
            (t) => t._id !== savedTodo._id
          );
        },
        (error) => {
          console.error('Error marking todo as not done:', error);
          alert('Failed to unmark task. Please try again.');
        }
      );
  }
}
