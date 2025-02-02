from B import B


class MM:
    def __init__(self, l):
        self.l = l

    def go(self):
        while True:
            self.m()
            x = input("Option (1-6): ").strip()

            if x == "1":
                self.l.d()
            elif x == "2":
                self.s()
            elif x == "3":
                self.b()
            elif x == "4":
                self.r()
            elif x == "5":
                self.n()
            elif x == "6":
                print("Bye!")
                break
            else:
                print("Bad input.")

    def m(self):
        print("\nOps:")
        print("1. All")
        print("2. Find")
        print("3. Borrow")
        print("4. Return")
        print("5. New")
        print("6. Quit")

    def s(self):
        t = input("Title? ").strip()
        i = self.l.f(t)
        if i:
            print(f"Found: '{i.t}' by {i.a} ({i.c})")
        else:
            print("No luck.")

    def b(self):
        t = input("Borrow what? ").strip()
        self.l.bor(t)

    def r(self):
        t = input("Return what? ").strip()
        self.l.ret(t)

    def n(self):
        t = input("New title? ").strip()
        a = input("Author? ").strip()
        try:
            c = int(input("Copies? ").strip())
            i = B(t, a, c)
            self.l.a(i)
        except ValueError:
            print("Bad number.")
