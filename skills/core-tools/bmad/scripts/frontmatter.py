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
    text = yaml.safe_dump(fields, sort_keys=False, allow_unicode=True, width=float("inf"))
    return f"---\n{text}---\n"
