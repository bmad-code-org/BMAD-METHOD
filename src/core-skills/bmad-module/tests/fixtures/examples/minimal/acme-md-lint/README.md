# acme-md-lint

A minimal BMAD module: one skill that lints markdown files under `_bmad/` for heading-hierarchy mistakes and broken relative links.

This is the **smallest valid module** that conforms to the [BMAD Module Manifest Specification](https://github.com/bmad-code-org/bmad-marketplace/blob/main/docs/spec.md). Use it as a starting template.

## Install

```
bmad-module install acme/acme-md-lint
```

Installs to `_bmad/mdlint/`.

## Use

After install, invoke from any Claude Code session:

```
/acme-md-lint
```

The skill walks every `.md` file under `_bmad/` and reports:

- Heading-level skips (e.g. `##` → `####`)
- Missing H1
- Relative links whose targets don't exist on disk

## Uninstall

```
bmad-module remove mdlint
```

## License

MIT. See `LICENSE`.
