class Book:
    def __init__(self, title, author, copies):
        self.title = title
        self.author = author
        self.copies = copies

    def display(self):
        print(f"'{self.title}' by {self.author} (Copies available: {self.copies})")
