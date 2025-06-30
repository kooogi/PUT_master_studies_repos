# Multi-Framework ToDo Application

This project demonstrates a full-stack ToDo list application built with a Node.js/Express/MongoDB backend and three separate frontend implementations using Angular, React, and Svelte.

The application allows users to:
*   Create and manage multiple ToDo lists.
*   Add tasks to specific ToDo lists.
*   Mark tasks as active or completed.
*   Move tasks between active and completed views.
*   Delete individual tasks.
*   Delete entire ToDo lists (which also removes all associated tasks).

## Project Structure

The project is organized into the following main parts:

1.  **Backend (`/your-backend-folder-name`)**: A Node.js application using Express.js and Mongoose to provide a RESTful API for managing ToDo lists and tasks, with data stored in MongoDB.
2.  **Angular Frontend (`/angular-todo-app`)**: A client-side application built with the Angular framework.
3.  **React Frontend (`/react-todo-app`)**: A client-side application built with the React library and Vite.
4.  **Svelte Frontend (`/svelte-todo-app`)**: A client-side application built with the Svelte framework and Vite.

## Features Implemented

*   **ToDo List Management:**
    *   View all ToDo lists.
    *   Create new ToDo lists.
    *   Delete ToDo lists (including all their tasks).
    *   Navigate to view tasks within a specific list.
*   **Task Management (within a selected list):**
    *   View active tasks.
    *   View completed tasks (separate view).
    *   Add new tasks to the active list.
    *   Mark active tasks as completed (moves them to the completed view).
    *   Mark completed tasks as active (moves them back to the active view - "Undo").
    *   Permanently delete tasks from either the active or completed view.
*   **User Interface:**
    *   Responsive layout styled with Bootstrap 5.
    *   Client-side routing for navigation between different views.

## Technologies Used

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (with Mongoose ODM)
*   `cors` for Cross-Origin Resource Sharing

**Angular Frontend:**
*   Angular (vX.Y.Z - _Specify your Angular version_)
*   TypeScript
*   Angular CLI
*   RxJS
*   `@angular/common/http` for API calls
*   `@angular/router` for routing
*   SCSS
*   Bootstrap 5 (via CDN or npm)

**React Frontend:**
*   React (vX.Y.Z - _Specify your React version_)
*   TypeScript
*   Vite (as the build tool and dev server)
*   `react-router-dom` (vX.Y.Z - _Specify version_) for routing
*   `axios` for API calls (or `fetch`)
*   Bootstrap 5 (via CDN or npm)

**Svelte Frontend:**
*   Svelte (vX.Y.Z - _Specify your Svelte version_)
*   TypeScript
*   Vite (as the build tool and dev server)
*   `svelte-routing` (vX.Y.Z - _Specify version_) for routing
*   `axios` for API calls (or `fetch`)
*   Bootstrap 5 (via CDN or npm)

## Prerequisites

*   Node.js (v18.x or later recommended) & npm
*   MongoDB installed and running locally (or a connection string to a cloud instance like MongoDB Atlas).

## Setup and Running the Application

You need to run the backend server and one of the frontend applications simultaneously.

### 1. Backend Setup

```bash
# Navigate to the backend project directory
cd your-backend-folder-name # e.g., multi-list-todo-backend

# Install dependencies
npm install

# Configure MongoDB Connection (if necessary)
# Open `server.js` (or your main backend file) and ensure the MONGO_URI
# variable points to your MongoDB instance.
# Default: const MONGO_URI = 'mongodb://localhost:27017/multiTodoApp';

# Start the backend server
npm start
# The backend API will be running on http://localhost:4000 by default.
```
### 2. Frontend Setup (Choose one)
#### A. Angular Frontend
```bash
# Navigate to the Angular project directory
cd angular-todo-app

# Install dependencies
npm install

# Start the Angular development server
ng serve
# The Angular app will be running on http://localhost:4200 by default.
# API requests will be proxied to the backend on port 4000.
```
#### B. React Frontend
```bash
# Navigate to the React project directory
cd react-todo-app

# Install dependencies
npm install

# Start the React (Vite) development server
npm run dev
# The React app will likely be running on http://localhost:5173 (or another port shown in the terminal).
# API requests will be proxied to the backend on port 4000.
```
#### C. Svelte Frontend
```bash
# Navigate to the Svelte project directory
cd svelte-todo-app

# Install dependencies
npm install

# Start the Svelte (Vite) development server
npm run dev
# The Svelte app will likely be running on http://localhost:5173 (or another port shown in the terminal).
# API requests will be proxied to the backend on port 4000.
```
Once both the backend and your chosen frontend are running, open the frontend's URL in your browser to use the application.

### API Endpoints (Backend)

**ToDo Lists (`/api/todolists`):**

*   `GET /todolists`
    *   Get all ToDo lists.
*   `POST /todolists`
    *   Create a new ToDo list.
    *   Body:
        ```json
        {
          "name": "Your List Name"
        }
        ```
*   `GET /todolists/:listId`
    *   Get details of a single ToDo list.
*   `DELETE /todolists/:listId`
    *   Delete a ToDo list and all its associated tasks.

**ToDo Items (within a list - base path: `/api/todolists/:listId/todos`):**

*   `GET /todos` (relative to base path, so full path is `/api/todolists/:listId/todos`)
    *   Get all ToDo items for a specific list.
*   `POST /todos` (relative to base path, so full path is `/api/todolists/:listId/todos`)
    *   Create a new ToDo item for a specific list.
    *   Body:
        ```json
        {
          "text": "Your task description"
        }
        ```
*   `PATCH /todos/:todoId` (relative to base path, so full path is `/api/todolists/:listId/todos/:todoId`)
    *   Update a ToDo item (e.g., mark as done, change text).
    *   Body (send only fields to update):
        ```json
        {
          "done": true,
          "text": "Updated task text"
        }
        ```
        or
        ```json
        {
          "done": false
        }
        ```
*   `DELETE /todos/:todoId` (relative to base path, so full path is `/api/todolists/:listId/todos/:todoId`)
    *   Delete a specific ToDo item.


 This project was developed to explore and compare Angular, React, and Svelte for building a common application.
