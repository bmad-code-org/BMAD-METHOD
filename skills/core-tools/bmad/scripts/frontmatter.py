"""Split and serialize YAML frontmatter in Markdown documents."""

import re

import yaml

_FENCE = re.compile(r"^---[ \t]*(?:\r?\n|\Z)", re.MULTILINE)


def split(text: str) -> tuple[str, str]:
    """Return the YAML text and body as written, a leading byte-order mark dropped. Both fences must start a line."""
    text = text.removeprefix("\ufeff")
    opening = _FENCE.match(text)
    if opening is None:
        raise ValueError("document has no frontmatter")
    closing = _FENCE.search(text, opening.end())
    if closing is None:
        raise ValueError("frontmatter is not terminated")
    return text[opening.end() : closing.start()], text[closing.end() :]


class _TypedLoader(yaml.SafeLoader):
    pass


_TypedLoader.yaml_implicit_resolvers = {
    first: [(tag, rx) for tag, rx in resolvers if tag == "tag:yaml.org,2002:null"]
    for first, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}
_TypedLoader.add_implicit_resolver("tag:yaml.org,2002:bool", re.compile(r"^(?:true|false)$"), list("tf"))
_TypedLoader.add_implicit_resolver("tag:yaml.org,2002:int", re.compile(r"^-?(?:0|[1-9][0-9]*)$"), list("-0123456789"))


def load(text: str, typed: bool = False) -> dict:
    """Load a YAML mapping with scalar values kept as text. Raise ValueError on invalid input.

    With `typed`, unquoted `true`, `false`, whole numbers and null read as bool, int and None: `1.10` and a
    date stay the text they were written as. The ValueError of invalid YAML is raised from the YAMLError.
    """
    try:
        fields = yaml.load(text, Loader=_TypedLoader if typed else yaml.BaseLoader)
    except yaml.YAMLError as exc:
        raise ValueError(str(exc)) from exc
    if fields is None:
        return {}
    if not isinstance(fields, dict):
        raise ValueError("frontmatter must be a YAML mapping")
    return fields


class Quoted(str):
    """Text that `dump` and `set_fields` write in double quotes."""


def dump(fields: dict, flow_lists: bool = False) -> str:
    """Return a fenced YAML block ending in a newline, each list on one line when `flow_lists`."""
    return f"---\n{_yaml(fields, _FlowLists if flow_lists else _Dumper)}---\n"


def set_fields(text: str, fields: dict, remove: tuple[str, ...] = ()) -> str:
    """Return the YAML text with each field's top-level entry rewritten and `remove` dropped.

    A new field goes after the field listed before it in `fields`, or at the end. Every other line,
    comments included, is kept as written. A list is written on one line. Raise ValueError when the
    text cannot be rewritten entry by entry, as with a flow mapping or an alias to another entry.
    """
    entries: list[str] = []
    for line in text.splitlines(keepends=True):
        if entries and (not line.strip() or line[0] in " \t-"):
            if line.strip() and len(entries) > 1 and _key(entries[-1]) is None:
                comment = entries.pop()  # a comment inside a block list belongs to that field
                entries[-1] += comment
            entries[-1] += line
        else:
            entries.append(line)
    present = {_key(entry) for entry in entries}
    order = list(fields)
    out, written = [], set()
    for entry in entries:
        key = _key(entry)
        if key in remove:
            continue
        if key not in fields:
            out.append(entry if entry.endswith("\n") else entry + "\n")
            continue
        out.append(_yaml({key: fields[key]}, _FlowLists))
        written.add(key)
        for new in order[order.index(key) + 1 :]:
            if new in present:
                break
            out.append(_yaml({new: fields[new]}, _FlowLists))
            written.add(new)
    out += [_yaml({key: value}, _FlowLists) for key, value in fields.items() if key not in written]
    result = "".join(out)
    try:
        after = load(result)
    except ValueError:
        after = None
    if after is None or any(key not in after for key in fields) or any(key in after for key in remove):
        raise ValueError("frontmatter cannot be rewritten field by field")
    return result


def _key(entry: str) -> str | None:
    if entry.startswith("#"):
        return None
    try:
        return next(iter(load(entry)), None)
    except ValueError:
        return None


class _Dumper(yaml.SafeDumper):
    pass


_Dumper.add_representer(
    Quoted, lambda dumper, value: dumper.represent_scalar("tag:yaml.org,2002:str", str(value), style='"')
)


class _FlowLists(_Dumper):
    pass


_FlowLists.add_representer(
    list, lambda dumper, value: dumper.represent_sequence("tag:yaml.org,2002:seq", value, flow_style=True)
)


def _yaml(fields: dict, dumper: type) -> str:
    return yaml.dump(fields, Dumper=dumper, sort_keys=False, allow_unicode=True, width=float("inf"))
