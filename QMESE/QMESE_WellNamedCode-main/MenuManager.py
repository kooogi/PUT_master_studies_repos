from Book import Book

class MenuManager:
    def __init__(self, library):
        self.library = library

    def start(self):
        print(f"Welcome to the {self.library.name} library!")
        while True:
            self.display_menu()
            choice = input("Enter your choice (1-6): ").strip()

            if choice == "1":
                self.library.display_books()
            elif choice == "2":
                self.search_book()
            elif choice == "3":
                self.borrow_book()
            elif choice == "4":
                self.return_book()
            elif choice == "5":
                self.add_new_book()
            elif choice == "6":
                print("Thank you for visiting the library. Goodbye!")
                break
            else:
                print("Invalid choice. Please enter a number between 1 and 6.")

    def display_menu(self):
        print("\nOptions:")
        print("1. View all books")
        print("2. Search for a book")
        print("3. Borrow a book")
        print("4. Return a book")
        print("5. Add a new book")
        print("6. Exit")

    def search_book(self):
        title = input("Enter the title of the book to search: ").strip()
        book = self.library.find_book(title)
        if book:
            print(f"Found: {book.title} by {book.author} (Copies: {book.copies})")
        else:
            print(f"No book found with the title '{title}'.")

    def borrow_book(self):
        title = input("Enter the title of the book to borrow: ").strip()
        self.library.borrow_book(title)

    def return_book(self):
        title = input("Enter the title of the book to return: ").strip()
        self.library.return_book(title)

    def add_new_book(self):
        title = input("Enter the title of the new book: ").strip()
        author = input("Enter the author of the book: ").strip()
        try:
            copies = int(input("Enter the number of copies: ").strip())
            new_book = Book(title, author, copies)
            self.library.add_book(new_book)
        except ValueError:
            print("Invalid input for copies. Please enter a number.")
