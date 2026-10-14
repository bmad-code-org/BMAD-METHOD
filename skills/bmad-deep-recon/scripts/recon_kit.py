#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""recon_kit — deterministic helpers for bmad-deep-recon.

The mechanical half of the research workflow: everything here is exact,
repeatable work the LLM should never re-derive by hand. All subcommands
print one JSON object to stdout; diagnostics go to stderr. Exit codes:
0 = pass, 1 = findings that need attention, 2 = usage/parse error.

Subcommands:
  citations RESEARCH_MD
      Cross-check inline [n] markers against the source-appendix table:
      dangling markers (no appendix row) and orphaned rows (never cited).
  tally MEMLOG_MD
      Count memlog entries by type, and claim entries by status.
      Claim lines carry `status=<word>` and optionally `ref=[n]`; for a
      given ref the LAST status wins, so status changes are appends.
  staleness CLAIMS_JSON --windows JSON [--today YYYY-MM-DD]
      Given claims [{claim, class, pub_date}] and a months-per-class map
      (e.g. '{"size/growth": 18, "pricing": 3}'), compute each claim's
      re-check date, flag stale ones, and report the earliest re-check.
  slug TOPIC --type TYPE [--pattern P] [--date YYYY-MM-DD]
      Expand the run-folder pattern deterministically so the same topic
      always lands in the same folder across draft -> process -> refresh.
  escape-sources RESEARCH_MD
      Emit the source-appendix table as HTML with every cell escaped and
      only validated http(s) URLs turned into links, for the briefing.
  anchors RESEARCH_MD --repo PATH [--at REV]
      Re-find each `path:line (symbol) @ sha` and `sha "subject" #pr`
      citation in git. A code claim is anchored, moved, incomplete,
      missing or unknown-commit; a history claim is anchored,
      subject-mismatch, pr-mismatch or unknown-commit.
      moved means the file changed between the cited commit and --at (default HEAD), not that the line shifted; head_line says where the cited text now sits, or null when it is gone.
      incomplete means the symbol is empty; pr-mismatch means the subject ends in (#n) and the citation names no PR or another one; unparsed lists citation-shaped text no claim matched. All three fail the run. symbol_found says whether the symbol's last identifier is in the cited lines or the 80 lines above them; it never fails the run.
"""

from __future__ import annotations

import argparse
import calendar
import html
import json
import os
import posixpath
import re
import subprocess
import sys
import unicodedata
from collections import Counter
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urlparse

MARKER_RE = re.compile(r"\[(\d+)\](?!\()")  # [3] but not a [3](url) link
# URLs may hold one level of balanced parentheses, as Wikipedia's often do.
MD_LINK_RE = re.compile(r"\[([^\]]*)\]\(((?:[^\s()]|\([^\s()]*\))+)\)")
BARE_URL_RE = re.compile(r"https?://(?:[^\s()|\]]|\([^\s()]*\))+")
ROW_ID_RE = re.compile(r"\[(\d+)\]")  # appendix row id: [n], never a bare number
FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})")  # any indent: fences nest in list items


def out(payload: dict, exit_code: int) -> int:
    print(json.dumps(payload, indent=2, ensure_ascii=False, default=str))
    return exit_code


def read_text(path_arg: str) -> str:
    if path_arg == "-":
        # Decode the bytes ourselves: the locale's encoding may not be UTF-8.
        buffer = getattr(sys.stdin, "buffer", None)
        return buffer.read().decode("utf-8") if buffer is not None else sys.stdin.read()
    return Path(path_arg).read_text(encoding="utf-8")


def strip_fences(text: str) -> str:
    """Blank out fenced code blocks so their contents never count as markers or rows.

    Fences pair CommonMark-style: a block closes only on a line of the opener's
    character, at least as long, with nothing after it.
    """
    lines, open_fence = [], None  # (char, length) while inside a fenced block
    for ln in text.splitlines():
        fence = FENCE_RE.match(ln)
        if open_fence is None:
            if fence:
                open_fence = (fence.group(1)[0], len(fence.group(1)))
            lines.append("" if fence else ln)
            continue
        marker = fence.group(1) if fence else ""
        if marker[:1] == open_fence[0] and len(marker) >= open_fence[1] and ln.strip() == marker:
            open_fence = None
        lines.append("")
    return "\n".join(lines)


def table_cells(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def appendix_rows(text: str) -> dict[int, list[str]]:
    """Source-appendix rows: markdown table rows whose first cell is [n]."""
    rows: dict[int, list[str]] = {}
    for ln in text.splitlines():
        stripped = ln.strip()
        if not stripped.startswith("|"):
            continue
        cells = table_cells(stripped)
        if not cells or len(cells) < 2:
            continue
        m = ROW_ID_RE.fullmatch(cells[0])
        if m:
            rows[int(m.group(1))] = cells
    return rows


# --- citations ---------------------------------------------------------------


def cmd_citations(args) -> int:
    text = strip_fences(read_text(args.file))
    rows = appendix_rows(text)
    markers: set[int] = set()
    for ln in text.splitlines():
        stripped = ln.strip()
        if stripped.startswith("|"):
            cells = table_cells(stripped)
            if cells and ROW_ID_RE.fullmatch(cells[0]):
                continue  # an appendix row is not a citation of itself
        markers.update(int(n) for n in MARKER_RE.findall(ln))
    dangling = sorted(markers - set(rows))
    orphaned = sorted(set(rows) - markers)
    ok = not dangling and not orphaned
    return out(
        {
            "markers": sorted(markers),
            "appendix_rows": sorted(rows),
            "dangling_markers": dangling,
            "orphaned_rows": orphaned,
            "ok": ok,
        },
        0 if ok else 1,
    )


# --- tally -------------------------------------------------------------------

ENTRY_RE = re.compile(r"^- (?:\(([\w-]+)(?: by [^)]*)?\)\s*)?(.*)$")


def cmd_tally(args) -> int:
    text = read_text(args.file)
    body = text.split("---", 2)[-1] if text.startswith("---") else text
    by_type: dict[str, int] = {}
    by_ref: dict[int, str] = {}
    unref_status: dict[str, int] = {}
    entries = 0
    for ln in body.splitlines():
        m = ENTRY_RE.match(ln)
        if not m or not ln.startswith("- "):
            continue
        entries += 1
        etype = m.group(1) or "note"
        by_type[etype] = by_type.get(etype, 0) + 1
        if etype == "claim":
            status_m = re.search(r"status=([\w-]+)", m.group(2))
            status = status_m.group(1) if status_m else "unknown"
            ref_m = re.search(r"ref=\[?(\d+)\]?", m.group(2))
            if ref_m:
                by_ref[int(ref_m.group(1))] = status  # last status wins per ref
            else:
                unref_status[status] = unref_status.get(status, 0) + 1
    claims: dict[str, int] = dict(unref_status)
    for status in by_ref.values():
        claims[status] = claims.get(status, 0) + 1
    return out(
        {
            "entries": entries,
            "by_type": dict(sorted(by_type.items())),
            "claims": dict(sorted(claims.items())),
            "claims_total": sum(claims.values()),
        },
        0,
    )


# --- staleness ---------------------------------------------------------------


def parse_date(raw: str) -> date:
    raw = raw.strip()
    for fmt in ("%Y-%m-%d", "%Y-%m", "%Y"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"unparseable date: {raw!r} (want YYYY[-MM[-DD]])")


def add_months(d: date, months: int) -> date:
    total = d.month - 1 + months
    year, month = d.year + total // 12, total % 12 + 1
    return date(year, month, min(d.day, calendar.monthrange(year, month)[1]))


def cmd_staleness(args) -> int:
    try:
        payload = json.loads(read_text(args.file))
        raw_windows = json.loads(args.windows)
        if not isinstance(raw_windows, dict):
            raise ValueError("--windows must be a JSON object of class -> months")
        windows = {k.lower(): int(v) for k, v in raw_windows.items()}
        today = parse_date(args.today) if args.today else date.today()
    except (TypeError, ValueError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    claims = payload.get("claims") if isinstance(payload, dict) else payload
    if not isinstance(claims, list) or not all(isinstance(c, dict) for c in claims):
        print('error: claims must be a JSON array of objects, or {"claims": [...]}', file=sys.stderr)
        return 2
    results, no_window, stale_count = [], set(), 0
    earliest: date | None = None
    for c in claims:
        cls = str(c.get("class", "")).lower()
        try:
            pub = parse_date(str(c["pub_date"]))
        except (KeyError, ValueError) as e:
            print(f"error in claim {c!r}: {e}", file=sys.stderr)
            return 2
        months = windows.get(cls)
        if months is None:
            no_window.add(cls)
            results.append({**c, "recheck": None, "stale": None})
            continue
        recheck = add_months(pub, months)
        stale = recheck <= today
        stale_count += stale
        earliest = recheck if earliest is None or recheck < earliest else earliest
        results.append({**c, "recheck": recheck.isoformat(), "stale": stale})
    return out(
        {
            "today": today.isoformat(),
            "claims": results,
            "stale_count": stale_count,
            "earliest_recheck": earliest.isoformat() if earliest else None,
            "no_window_classes": sorted(no_window),
        },
        1 if stale_count else 0,
    )


# --- slug --------------------------------------------------------------------


def slugify(text: str, max_len: int = 40) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return re.sub(r"-{2,}", "-", text)[:max_len].rstrip("-")


def cmd_slug(args) -> int:
    slug = slugify(args.topic)
    if not slug:
        print("error: topic slugified to an empty string", file=sys.stderr)
        return 2
    folder = (
        args.pattern.replace("{research_type}", args.type)
        .replace("{topic_slug}", slug)
        .replace("{date}", args.date or date.today().isoformat())
    )
    return out({"topic_slug": slug, "folder": folder}, 0)


# --- escape-sources ----------------------------------------------------------


def safe_url(raw: str) -> str | None:
    parsed = urlparse(raw)
    return raw if parsed.scheme in ("http", "https") and parsed.netloc else None


def cell_html(cell: str, invalid: list[str]) -> str:
    """Escape a cell; a markdown link or bare URL becomes an <a> only when http(s)."""
    link = MD_LINK_RE.search(cell)
    if link:
        url = safe_url(link.group(2))
        label = html.escape(link.group(1) or link.group(2))
        if url:
            return (
                html.escape(cell[: link.start()])
                + f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="noopener">{label}</a>'
                + html.escape(cell[link.end() :])
            )
        invalid.append(link.group(2))
        return html.escape(cell.replace(link.group(0), link.group(1) or link.group(2)))
    bare = BARE_URL_RE.search(cell)
    if bare:
        url = safe_url(bare.group(0))
        if url:
            escaped = html.escape(url, quote=True)
            return (
                html.escape(cell[: bare.start()])
                + f'<a href="{escaped}" target="_blank" rel="noopener">{escaped}</a>'
                + html.escape(cell[bare.end() :])
            )
        invalid.append(bare.group(0))
    return html.escape(cell)


def cmd_escape_sources(args) -> int:
    text = strip_fences(read_text(args.file))
    rows = appendix_rows(text)
    if not rows:
        print("error: no source-appendix table rows found", file=sys.stderr)
        return 2
    invalid: list[str] = []
    body_rows = []
    for n in sorted(rows):
        cells = rows[n]
        tds = "".join(f"<td>{cell_html(c, invalid)}</td>" for c in cells[1:])
        body_rows.append(f'<tr id="src-{n}"><td>[{n}]</td>{tds}</tr>')
    table = '<table class="sources"><tbody>' + "".join(body_rows) + "</tbody></table>"
    return out({"rows": len(rows), "invalid_urls": invalid, "html": table}, 1 if invalid else 0)


# --- anchors -----------------------------------------------------------------

# A path starts a token, so a URL is never read as one, and may hold a balanced (group) as Next.js routes do.
PATH_CHAR = r"(?:[^\s:`'\"()<>|*]|\([^\s:`'\"()<>|*/]*\))"
CITED_PATH = rf"(?<![\w./:\\)-])({PATH_CHAR}+)"
# A path may hold spaces, so this takes up to five words before it; spaced_path keeps those the commit's tree has.
CODE_CLAIM_RE = re.compile(
    rf"(?<![\w./:\\)-])({PATH_CHAR}+(?: {PATH_CHAR}+){{0,5}})"
    + r":(\d+)(?:-(\d+))?[ \t]*\(([^()\n]*)\)[ \t]*@[ \t]*([0-9a-f]{7,40})\b"
)
# Not after "@ ": that sha ends a code claim, and a quote after it is not a subject.
# A subject may hold quotes (Revert "x"): it ends at a quote not followed by a word or another quote.
HISTORY_CLAIM_RE = re.compile(r"(?<![\w./:\\-])(?<!@ )([0-9a-f]{7,40})[ \t]+\"(.+?)\"(?![\w\"])(?:[ \t]+#(\d+))?")
PR_SUFFIX_RE = re.compile(r"\s*\(#(\d+)\)$")
SUBJECT_END_RE = re.compile(r"\"(?:[ \t]+#(\d+))?")
# Citation-shaped text: what no claim consumed is reported as unparsed.
LOOSE_CODE_RE = re.compile(
    CITED_PATH + r":\d+(?:[-:]\d+)*\b(?:[ \t]*\((?:[^()\n]|\([^()\n]*\))*\))?(?:[ \t]*@[ \t]*[0-9a-fA-F]{7,40}\b)?"
)
FILE_EXT_RE = re.compile(r"\.\w*[A-Za-z]\w*$")
SHA_TAIL_RE = re.compile(r"(?<![\w.@/-])@[ \t]*[0-9a-fA-F]{7,40}\b")  # not user@host or action@sha
CURLY_SUBJECT_RE = re.compile(
    r"(?<![\w./:\\-])[0-9a-fA-F]{7,40}[ \t]+[\u2018\u2019\u201c\u201d][^\n]*?(?:[\u2018\u2019\u201c\u201d]|$)", re.M
)
RANGE_DASH_RE = re.compile(r"(:\d+)[\u2013\u2014](?=\d)")
CURLY_DOUBLE = str.maketrans("\u201c\u201d", '""')
CURLY_ANY = str.maketrans("\u201c\u201d\u2018\u2019", "\"\"''")
# What git prints when the object or path is not there; any other failure is an error.
GIT_MISSING_RE = re.compile(
    r"not a valid object name|does not exist in|exists on disk, but not in|bad file|outside repository", re.I
)


class GitError(Exception):
    """git failed for a reason other than a missing object or path."""

    def __init__(self, proc: subprocess.CompletedProcess[str]):
        super().__init__(f"git {' '.join(proc.args[1:])} exited {proc.returncode}: {proc.stderr.strip()}")


def git(repo: Path, *args: str) -> subprocess.CompletedProcess[str]:
    # Drop GIT_DIR and the rest: a git hook exports them, and they would override --repo.
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    env["LC_ALL"] = "C"  # untranslated messages, which GIT_MISSING_RE reads
    return subprocess.run(
        ["git", *args], cwd=repo, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )


def raise_unless_missing(proc: subprocess.CompletedProcess[str]) -> None:
    if not GIT_MISSING_RE.search(proc.stderr):
        raise GitError(proc)


def repo_root(path: Path) -> Path | None:
    if not path.exists():
        return None
    proc = git(path if path.is_dir() else path.parent, "rev-parse", "--show-toplevel")
    top = proc.stdout.strip()
    return Path(top) if proc.returncode == 0 and top else None


def blob_lines(repo: Path, rev: str, path: str) -> list[str] | None:
    """The file's lines at rev, or None when rev holds no file at path."""
    proc = git(repo, "cat-file", "blob", f"{rev}:{path}")  # not git show, which lists a directory with exit 0
    if proc.returncode:
        raise_unless_missing(proc)
        return None
    lines = proc.stdout.split("\n")  # as git counts lines; splitlines() also breaks on form feeds
    return lines[:-1] if lines[-1] == "" else lines


def is_commit(repo: Path, sha: str) -> bool:
    proc = git(repo, "cat-file", "-e", f"{sha}^{{commit}}")
    if proc.returncode:
        raise_unless_missing(proc)
    return proc.returncode == 0


def tree_paths(repo: Path, sha: str, cache: dict[str, set[str]]) -> set[str]:
    """Every file path at sha, or none when sha is not a commit."""
    if sha not in cache:
        proc = git(repo, "ls-tree", "-r", "--name-only", "-z", sha) if is_commit(repo, sha) else None
        if proc is not None and proc.returncode:
            raise_unless_missing(proc)
        cache[sha] = set(proc.stdout.split("\0")) if proc is not None and not proc.returncode else set()
    return cache[sha]


def spaced_path(repo: Path, m: re.Match, cache: dict[str, set[str]]) -> tuple[str, int]:
    """The cited path and where it starts: the most trailing words of the match's path the commit's tree has, else the last."""
    words = m[1].split(" ")
    paths = tree_paths(repo, m[5], cache) if len(words) > 1 else set()
    for i in range(len(words) - 1):
        if posixpath.normpath(" ".join(words[i:])) in paths:
            break
    else:
        i = len(words) - 1
    return " ".join(words[i:]), m.start(1) + len(" ".join(words[:i])) + (1 if i else 0)


def history_claim(repo: Path, m: re.Match) -> tuple[str, str, int | None, tuple[int, int]]:
    """sha, subject, pr and span of a history match, its subject run on to the last quote on the line that keeps it a prefix of git's own."""
    sha, subject, pr, span = m[1], m[2], int(m[3]) if m[3] else None, m.span()
    text = m.string
    quotes = [m.end(2) + 1 + i for i, c in enumerate(text[m.end(2) + 1 :].split("\n", 1)[0]) if c == '"']
    if quotes and is_commit(repo, sha):
        log = git(repo, "log", "-1", "--no-show-signature", "--format=%s", sha, "--")
        if log.returncode:
            raise GitError(log)
        actual = norm_subject(log.stdout)
        for q in reversed(quotes):
            if actual.startswith(norm_subject(text[m.start(2) : q])):
                end = SUBJECT_END_RE.match(text, q)
                subject, pr, span = text[m.start(2) : q], int(end[1]) if end[1] else None, (m.start(), end.end())
                break
    return sha, subject, pr, span


def find_block(lines: list[str], block: list[str]) -> int | None:
    """The 1-based line where block starts in lines, or None."""
    return next((i + 1 for i in range(len(lines) - len(block) + 1) if lines[i : i + len(block)] == block), None)


def symbol_found(symbol: str, lines: list[str]) -> bool:
    """Whether the symbol's last identifier stands as a whole word in lines."""
    parts = [part for part in re.split(r"::|[.#\s]", symbol) if part]
    return bool(parts) and re.search(rf"(?<!\w){re.escape(parts[-1])}(?!\w)", "\n".join(lines)) is not None


def check_code(repo: Path, at: str, sha: str, path: str, line: int, end_line: int | None, symbol: str) -> dict:
    unread = {"line_text": None, "changed_since": None, "head_line": None, "symbol_found": None}
    if not is_commit(repo, sha):
        return {"status": "unknown-commit", **unread}
    path = posixpath.normpath(path)  # git reads rev:path literally, so src/../x.md would need a folder named ".."
    lines = blob_lines(repo, sha, path)
    if lines is None or not all(1 <= n <= len(lines) for n in (line, end_line) if n is not None):
        return {"status": "missing", **unread}
    last = max(line, end_line or line)
    block = [text.strip() for text in lines[line - 1 : last]]
    # Literal, so a path such as app/[slug]/page.tsx is not read as a glob.
    diff = git(repo, "--literal-pathspecs", "diff", "--quiet", sha, at, "--", path)
    if diff.returncode not in (0, 1):
        raise GitError(diff)
    if diff.returncode == 0:
        status, head_line = "anchored", line
    else:
        head = [text.strip() for text in blob_lines(repo, at, path) or []]
        status, head_line = "moved", find_block(head, block) or find_block(head, block[:1])
    return {
        "status": status if symbol else "incomplete",
        "line_text": block[0],
        "changed_since": diff.returncode == 1,
        "head_line": head_line,
        "symbol_found": symbol_found(symbol, lines[max(0, line - 81) : last]),
    }


def subject_pr(subject: str) -> int | None:
    m = PR_SUFFIX_RE.search(" ".join(subject.split()))
    return int(m.group(1)) if m else None


def norm_subject(subject: str) -> str:
    return PR_SUFFIX_RE.sub("", " ".join(subject.translate(CURLY_ANY).split())).casefold()


def check_history(repo: Path, sha: str, subject: str, pr: int | None) -> dict:
    if not is_commit(repo, sha):
        return {"status": "unknown-commit", "actual_subject": None, "actual_pr": None}
    log = git(repo, "log", "-1", "--no-show-signature", "--format=%s", sha, "--")
    if log.returncode:
        raise GitError(log)
    actual = log.stdout.strip()
    actual_pr = subject_pr(actual)
    named = {n for n in (pr, subject_pr(subject)) if n is not None}
    if not norm_subject(actual).startswith(norm_subject(subject)):
        status = "subject-mismatch"
    elif actual_pr is not None and named != {actual_pr}:
        status = "pr-mismatch"
    else:
        status = "anchored"
    return {"status": status, "actual_subject": actual, "actual_pr": actual_pr}


def normalize(text: str) -> str:
    """Fold en and em dash ranges and curly double quotes to ASCII, one character for one, so offsets still match."""
    return RANGE_DASH_RE.sub(r"\1-", text.translate(CURLY_DOUBLE))


def unparsed_spans(text: str, norm: str, consumed: list[tuple[int, int]]) -> list[dict]:
    """Citation-shaped spans no claim consumed, overlapping ones merged, as written in text."""
    taken = bytearray(len(text))
    for start, end in consumed:
        taken[start:end] = b"\1" * (end - start)
    spans = [m.span() for m in LOOSE_CODE_RE.finditer(norm) if "/" in m[1] or FILE_EXT_RE.search(m[1])]
    spans += [m.span() for m in SHA_TAIL_RE.finditer(norm)]
    spans += [m.span() for m in CURLY_SUBJECT_RE.finditer(text)]  # text, since norm has no curly double quotes
    merged: list[list[int]] = []
    for start, end in sorted(spans):
        if taken.find(1, start, end) >= 0:
            continue
        if merged and start < merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    found, line, pos = [], 1, 0
    for start, end in merged:
        line += text.count("\n", pos, start)
        pos = start
        found.append({"text": text[start:end], "line": line})
    return found


def cmd_anchors(args) -> int:
    text = read_text(args.file)
    repo = repo_root(Path(args.repo))
    if repo is None:
        print(f"error: --repo {args.repo} is not inside a git working tree", file=sys.stderr)
        return 2
    at = git(repo, "rev-parse", "--verify", "--quiet", f"{args.at}^{{commit}}").stdout.strip()
    if not at:
        print(f"error: --at {args.at} does not name a commit", file=sys.stderr)
        return 2
    norm = normalize(text)
    trees: dict[str, set[str]] = {}
    code_matches = [(m, *spaced_path(repo, m, trees)) for m in CODE_CLAIM_RE.finditer(norm)]
    code_claims = Counter(
        (path, int(m[2]), int(m[3]) if m[3] else None, m[4].strip(), m[5]) for m, path, _ in code_matches
    )
    history_matches: list[tuple[str, str, int | None, tuple[int, int]]] = []
    for m in HISTORY_CLAIM_RE.finditer(norm):
        if not history_matches or m.start() >= history_matches[-1][3][1]:  # not inside a subject run on past its quote
            history_matches.append(history_claim(repo, m))
    history_claims = Counter((sha, subject, pr) for sha, subject, pr, _ in history_matches)
    code = [
        {
            "path": path,
            "line": line,
            "end_line": end_line,
            "symbol": symbol,
            "commit": sha,
            **check_code(repo, at, sha, path, line, end_line, symbol),
            "occurrences": n,
        }
        for (path, line, end_line, symbol, sha), n in code_claims.items()
    ]
    history = [
        {"commit": sha, "subject": subject, "pr": pr, **check_history(repo, sha, subject, pr), "occurrences": n}
        for (sha, subject, pr), n in history_claims.items()
    ]
    consumed = [(start, m.end()) for m, _, start in code_matches] + [span for *_, span in history_matches]
    unparsed = unparsed_spans(text, norm, consumed)
    statuses = Counter(c["status"] for c in code + history)
    failing = ("incomplete", "missing", "unknown-commit", "subject-mismatch", "pr-mismatch")
    counts = {"code": len(code), "history": len(history)}
    for status in ("anchored", "moved", *failing):
        counts[status.replace("-", "_")] = statuses[status]
    counts["unparsed"] = len(unparsed)
    failed = sum(statuses[status] for status in failing) + len(unparsed)
    return out(
        {
            "file": args.file,
            "repo": str(repo),
            "at": at,
            "code": code,
            "history": history,
            "unparsed": unparsed,
            "counts": counts,
        },
        1 if failed else 0,
    )


# --- entry point -------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    pc = sub.add_parser("citations", help="cross-check [n] markers vs the source appendix")
    pc.add_argument("file", help="path to the research report (or - for stdin)")
    pc.set_defaults(func=cmd_citations)

    pt = sub.add_parser("tally", help="count memlog entries by type and claims by status")
    pt.add_argument("file", help="path to .memlog.md (or - for stdin)")
    pt.set_defaults(func=cmd_tally)

    ps = sub.add_parser("staleness", help="compute re-check dates from freshness windows")
    ps.add_argument("file", help="claims JSON: [{claim, class, pub_date}] (or - for stdin)")
    ps.add_argument("--windows", required=True, help="JSON months-per-class map, e.g. '{\"pricing\": 3}'")
    ps.add_argument("--today", help="override today's date (YYYY-MM-DD)")
    ps.set_defaults(func=cmd_staleness)

    pg = sub.add_parser("slug", help="expand the run-folder pattern deterministically")
    pg.add_argument("topic", help="research topic text")
    pg.add_argument("--type", required=True, help="research type code (e.g. market)")
    pg.add_argument(
        "--pattern",
        default="research-{topic_slug}",
        help="folder pattern (default: research-{topic_slug})",
    )
    pg.add_argument("--date", help="override date (YYYY-MM-DD; default today)")
    pg.set_defaults(func=cmd_slug)

    pe = sub.add_parser("escape-sources", help="source appendix as escaped HTML with validated links")
    pe.add_argument("file", help="path to the research report (or - for stdin)")
    pe.set_defaults(func=cmd_escape_sources)

    pa = sub.add_parser(
        "anchors",
        help="re-find each code and history citation in git",
        description=(
            "moved means the file changed between the cited commit and --at (default HEAD), not that the line shifted; head_line says where the cited text now sits, or null when it is gone. "
            "incomplete means the symbol is empty; pr-mismatch means the subject ends in (#n) and the citation names no PR or another one; unparsed lists citation-shaped text no claim matched. All three fail the run. symbol_found says whether the symbol's last identifier is in the cited lines or the 80 lines above them; it never fails the run."
        ),
    )
    pa.add_argument("file", help="path to the research report (or - for stdin)")
    pa.add_argument("--repo", required=True, help="the git working tree, or any path inside it")
    pa.add_argument("--at", default="HEAD", help="revision to compare against (default: HEAD)")
    pa.set_defaults(func=cmd_anchors)

    args = p.parse_args(argv)
    try:
        return args.func(args)
    except (FileNotFoundError, GitError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
