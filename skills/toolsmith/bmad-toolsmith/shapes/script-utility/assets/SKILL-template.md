---
name: {name}
description: '{description}'
---
# {title}

{purpose: one or two lines on what the script does and what the result is for.} The script does the work; this file says how to run it and what to do with what comes back.

## Run

```bash
uv run {skill-root}/scripts/{script}.py {arguments}
```

`--help` lists every option. {When to pass which option, one line each, only where the choice takes judgment.}

## Read the result

{The output shape: the JSON keys and what each means, or what the text report shows. What a good result looks like, and what each kind of finding asks you to do next.}

## When it fails

A non-zero exit prints one line on stderr saying why. Report that line to the user; do not do the job by hand instead. {Failures the user can fix and what to tell them: a missing input, a malformed file, a path outside the project.}
