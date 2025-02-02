from Library import Library
from Book import Book
from MenuManager import MenuManager

def main():
    book1 = Book("Clean Code", "Uncle Bob Martin", 3)
    book2 = Book("Refactoring", "Martin Fowler", 5)
    book3 = Book("Software engineering techniques in progress", "Jerzy Nawrocki", 10)

    library = Library("QMESE", [book1, book2, book3])

    menu_manager = MenuManager(library)
    menu_manager.start()

if __name__ == "__main__":
    main()