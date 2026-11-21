"""Split and serialize YAML frontmatter in Markdown documents."""

import re

import yaml

_FENCE = re.compile(r"^---[ \t]*(?:\r?\n|\Z)", re.MULTILINE)


def split(text: str) -> tuple[str, str]:
    """Return the YAML text and body as written. Both fences must start a line."""
    opening = _FENCE.match(text)
    if opening is None:
        raise ValueError("document has no frontmatter")
    closing = _FENCE.search(text, opening.end())
    if closing is None:
        raise ValueError("frontmatter is not terminated")
    return text[opening.end() : closing.start()], text[closing.end() :]


def load(text: str) -> dict:
    """Load a YAML mapping with scalar values kept as text. Raise ValueError on invalid input."""
    try:
        fields = yaml.load(text, Loader=yaml.BaseLoader)
    except yaml.YAMLError as exc:
        raise ValueError(str(exc)) from exc
    if fields is None:
        return {}
    if not isinstance(fields, dict):
        raise ValueError("frontmatter must be a YAML mapping")
    return fields


def dump(fields: dict) -> str:
    """Return a fenced YAML block ending in a newline."""
    return f"---\n{_yaml(fields)}---\n"


def set_fields(text: str, fields: dict) -> str:
    """Return the YAML text with each field's top-level entry rewritten and new fields appended.

    Every other line, comments included, is kept as written.
    """
    entries: list[str] = []
    for line in text.splitlines(keepends=True):
        if entries and (not line.strip() or line[0] in " \t-"):
            entries[-1] += line
        else:
            entries.append(line)
    out, written = [], set()
    for entry in entries:
        key = _key(entry)
        if key in fields:
            out.append(_yaml({key: fields[key]}))
            written.add(key)
        else:
            out.append(entry if entry.endswith("\n") else entry + "\n")
    out += [_yaml({key: value}) for key, value in fields.items() if key not in written]
    return "".join(out)


def _key(entry: str) -> str | None:
    if entry.startswith("#"):
        return None
    try:
        return next(iter(load(entry)), None)
    except ValueError:
        return None


def _yaml(fields: dict) -> str:
    return yaml.safe_dump(fields, sort_keys=False, allow_unicode=True, width=float("inf"))
