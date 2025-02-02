class Library:
    def __init__(self, name, books=None):
        self.name = name
        self.books = books if books else []

    def __str__(self):

        return f"{self.name} has {len(self.books)} books."

    def __repr__(self):
        return f"<Library {self.name}>"

    def display_books(self):
        if not self.books:
            print("No books available in the library.")
            return
        print(f"\nBooks in {self.name}:")
        for book in self.books:
            book.display()

    def add_book(self, book):
        self.books.append(book)
        print(f"'{book.title}' has been added to the library.")

    def find_book(self, title):
        for book in self.books:
            if book.title.lower() == title.lower():
                return book
        return None

    def borrow_book(self, title):
        book = self.find_book(title)
        if book:
            if book.copies > 0:
                book.copies -= 1
                print(f"You have borrowed '{book.title}'.")
            else:
                print(f"'{book.title}' is currently out of stock.")
        else:
            print(f"'{title}' is not available in the library.")

    def return_book(self, title):
        book = self.find_book(title)
        if book:
            book.copies += 1
            print(f"You have returned '{book.title}'.")
        else:
            print(f"'{title}' does not belong to this library.")
