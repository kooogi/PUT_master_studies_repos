# Library Management System

This project is a simple Library Management System implemented in Python. It allows users to view available books, search for books, borrow and return books, and add new books to the library.

## Features
- View all books in the library.
- Search for a specific book by title.
- Borrow a book if available.
- Return a borrowed book.
- Add new books to the library.

## Prerequisites
- A GitHub account.
- Python 3.x installed in your environment (for local use).
- Access to GitHub Codespaces (for running the project online).

---

## How to Run the Project in GitHub Codespaces

1. **Clone the Repository**
   - Fork this repository to your GitHub account.
   - Navigate to your forked repository on GitHub.
   - Click the green `Code` button and select `Open with Codespaces`.

2. **Set Up the Environment**
   - Once the Codespace has started, ensure all files are present, including:
     - `main.py`
     - `Library.py`
     - `Book.py`
     - `MenuManager.py`

3. **Run the Program**
   - Open the built-in terminal in GitHub Codespaces.
   - Run the following command:
     ```bash
     python3 main.py
     ```
   - Follow the on-screen instructions to interact with the Library Management System.

4. **Exit the Program**
   - To exit the application, select option `6` from the menu.

---

## How to Run Locally (Optional)

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/<your-username>/library-management-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd library-management-system
   ```
3. Run the program:
   ```bash
   python3 main.py
   ```

---

## Example Menu Interaction

```
Options:
1. View all books
2. Search for a book
3. Borrow a book
4. Return a book
5. Add a new book
6. Exit
```

Simply type the corresponding number to select an option and follow the prompts.

---

## Project Structure

```
├── main.py          # Entry point of the application
├── Library.py       # Handles library-related operations
├── Book.py          # Defines the Book class
├── MenuManager.py   # Manages the menu and user interactions
```
