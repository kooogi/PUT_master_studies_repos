from L import L
from B import B
from MM import MM

def main():
    # Some items
    i1 = B("Clean Code", "Uncle Bob Martin", 3)
    i2 = B("Refactoring", "Martin Fowler", 5)
    i3 = B("Software engineering techniques in progress", "Jerzy Nawrocki", 10)

    # An instance
    lib = L("LibraryX", [i1, i2, i3])

    # Manage things
    m = MM(lib)
    m.go()

if __name__ == "__main__":
    main()
