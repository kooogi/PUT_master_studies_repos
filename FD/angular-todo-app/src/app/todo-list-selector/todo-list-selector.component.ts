import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TodoList, TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './todo-list-selector.component.html',
  styleUrls: ['./todo-list-selector.component.scss'],
})
export class TodoListSelectorComponent implements OnInit {
  todoLists: TodoList[] = [];
  newListName: string = '';

  constructor(private todoService: TodoService, private router: Router) {}

  ngOnInit(): void {
    this.loadTodoLists();
  }

  loadTodoLists(): void {
    this.todoService.getTodoLists().subscribe(
      (data) => {
        this.todoLists = data;
      },
      (error) => {
        console.error('Error loading ToDo lists:', error);
      }
    );
  }

  onCreateList(): void {
    if (!this.newListName.trim()) return;
    this.todoService.createTodoList(this.newListName).subscribe(
      (newList) => {
        this.todoLists.push(newList); // Add to local list
        this.newListName = '';
        // Navigate to the new list:
        this.router.navigate(['/lists', newList._id]);
      },
      (error) => {
        console.error('Error creating ToDo list:', error);
      }
    );
  }

  onDeleteList(listId: string, listName: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent navigation if the delete button is inside the <a> tag
    event.preventDefault(); // Also prevent default <a> tag behavior

    if (
      confirm(
        `Are you sure you want to delete the list "${listName}" and all its items? This cannot be undone.`
      )
    ) {
      this.todoService.deleteTodoList(listId).subscribe(
        (response) => {
          console.log(response.message); // Log success message from backend
          // Remove the list from the local array to update the UI
          this.todoLists = this.todoLists.filter((list) => list._id !== listId);
        },
        (error) => {
          console.error(`Error deleting ToDo list ${listId}:`, error);
          alert(
            `Failed to delete list: ${error.error?.message || error.message}`
          );
        }
      );
    }
  }
}
