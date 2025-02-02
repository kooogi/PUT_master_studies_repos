class L:
    def __init__(self, n, b=None):
        self.n = n
        self.b = b if b else []

    def __str__(self):
        return f"{self.n} has {len(self.b)} books."

    def __repr__(self):
        return f"<L {self.n}>"

    def d(self):
        if not self.b:
            print("Nothing here.")
            return
        print(f"\nBooks in {self.n}:")
        for i in self.b:
            i.d()

    def a(self, i):
        self.b.append(i)
        print(f"'{i.t}' added.")

    def f(self, t):
        for i in self.b:
            if i.t.lower() == t.lower():
                return i
        return None

    def bor(self, t):
        i = self.f(t)
        if i:
            if i.c > 0:
                i.c -= 1
                print(f"'{i.t}' borrowed.")
            else:
                print(f"'{i.t}' is out.")
        else:
            print(f"'{t}' not found.")

    def ret(self, t):
        i = self.f(t)
        if i:
            i.c += 1
            print(f"'{i.t}' returned.")
        else:
            print(f"'{t}' not ours.")
