# JavaScript Conventions

## Function ordering

Define functions top-to-bottom in call order: callers above callees. If `install()` calls `_initPaths()`, then `install` appears first and `_initPaths` appears after it.
