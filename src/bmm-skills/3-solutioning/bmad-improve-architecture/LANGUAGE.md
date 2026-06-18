# Architecture Language

Use these terms exactly.

## Terms

**Module**
Anything with an interface and an implementation. A function, class, package, or slice can all be a Module.

**Interface**
Everything a caller must know to use the Module correctly: types, ordering, invariants, error modes, required configuration, and performance expectations.

**Implementation**
The code behind the Interface.

**Depth**
Leverage at the Interface. A deep Module gives callers a lot of behavior behind a small Interface. A shallow Module exposes nearly as much complexity as it hides.

**Seam**
A place where behavior can change without editing in that place. Use `Seam`, not `boundary`.

**Adapter**
A concrete thing that satisfies an Interface at a Seam.

**Leverage**
What callers gain from Depth.

**Locality**
What maintainers gain from Depth. Bugs, change, and knowledge stay concentrated in one place.

## Rules

- Use `Module`, not `component`, `service`, or `unit`.
- Use `Interface`, not `API` or `signature`.
- Use `Seam`, not `boundary`.
- Use `Depth`, `Leverage`, and `Locality` when explaining why a recommendation matters.

## Principles

- The deletion test: if deleting the Module only removes indirection, it was shallow.
- The Interface is the test surface.
- One adapter means a hypothetical Seam. Two adapters mean a real one.
