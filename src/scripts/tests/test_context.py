# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Layer-1 deterministic tests for context.py (bmad-project-context mechanics).

Run: uv run --with pytest pytest src/scripts/tests/test_context.py

Written against the CLI contract in the skill design (§13/§14): each command has a
fixture-driven case list. No LLM, no network — "remote" fixtures are local bare repos
reached via file:// URLs.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
CONTEXT_PY = SCRIPTS_DIR / "context.py"

sys.path.insert(0, str(SCRIPTS_DIR))

INDEX_MARKER = "<!-- bmad:context index"
BLOCK_START = "<!-- bmad:context -->"
BLOCK_END = "<!-- /bmad:context -->"


def run(args, cwd, env_extra=None, check=False):
    env = os.environ.copy()
    if env_extra:
        env.update(env_extra)
    proc = subprocess.run(
        [sys.executable, str(CONTEXT_PY), *args],
        cwd=str(cwd), capture_output=True, text=True, env=env,
    )
    if check and proc.returncode != 0:
        raise AssertionError(f"context.py {args} failed rc={proc.returncode}\n{proc.stderr}")
    return proc


def jrun(args, cwd, check=True):
    proc = run(["--json", *args], cwd, check=check)
    out = proc.stdout.strip()
    return (json.loads(out) if out else {}), proc


def git(cwd, *args):
    subprocess.run(["git", *args], cwd=str(cwd), capture_output=True, check=True)


def make_git_repo(path):
    path.mkdir(parents=True, exist_ok=True)
    git(path, "init", "-q", "-b", "main")
    git(path, "config", "user.email", "t@t.t")
    git(path, "config", "user.name", "t")
    return path


ENTRY = """---
type: {type}
title: {title}
description: {description}
{trust}: {date}
{extra}---
{body}
"""


def write_entry(root, name, *, type="decision", title=None, description="d",
                trust="verified", date="2026-01-01", extra="", body="Body text."):
    root.mkdir(parents=True, exist_ok=True)
    (root / f"{name}.md").write_text(ENTRY.format(
        type=type, title=title or name, description=description,
        trust=trust, date=date, extra=extra, body=body))


def make_bundle(root, entries=("integer-cents", "repo-pattern")):
    root.mkdir(parents=True, exist_ok=True)
    (root / "kernel.md").write_text("# Project Kernel — fixture\n## Commands\n- Test: `pytest`\n")
    for e in entries:
        write_entry(root, e)
    return root


@pytest.fixture
def proj(tmp_path):
    """A project root with a bundle at docs/ and config naming it."""
    p = tmp_path / "proj"
    p.mkdir()
    make_bundle(p / "docs")
    cfg = p / "_bmad"
    cfg.mkdir()
    (cfg / "context.yaml").write_text("project_name: proj\nproject_knowledge: docs\n")
    return p


def indexed(proj_root):
    run(["index"], proj_root, check=True)
    return proj_root


# ── validate ─────────────────────────────────────────────────────────────────

class TestValidate:
    def test_clean_bundle_exit_0(self, proj):
        indexed(proj)
        proc = run(["validate"], proj)
        assert proc.returncode == 0

    def test_missing_type_caught(self, proj):
        (proj / "docs" / "bad.md").write_text(
            "---\ntitle: Bad\ndescription: d\nverified: 2026-01-01\n---\nBody.\n")
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("type" in f["issue"] for f in data["findings"])

    def test_unparseable_frontmatter_caught(self, proj):
        (proj / "docs" / "broken.md").write_text("---\ntype: decision\nno closing fence\n")
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("frontmatter" in f["issue"] for f in data["findings"])

    def test_dangling_link_caught(self, proj):
        write_entry(proj / "docs", "linker", body="See [gone](missing-entry.md).")
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("missing-entry.md" in f["issue"] for f in data["findings"])

    def test_entry_missing_from_index_caught(self, proj):
        indexed(proj)
        write_entry(proj / "docs", "orphan")
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("orphan" in f["issue"] and "index" in f["issue"] for f in data["findings"])

    def test_trust_field_required_and_exclusive(self, proj):
        (proj / "docs" / "untrusted.md").write_text(
            "---\ntype: decision\ntitle: U\ndescription: d\n---\nBody.\n")
        write_entry(proj / "docs", "double", extra="generated: 2026-01-02\n")
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        issues = " | ".join(f["issue"] for f in data["findings"])
        assert "untrusted.md" in " ".join(f["file"] for f in data["findings"])
        assert "verified" in issues or "generated" in issues

    def test_foreign_files_ignored(self, proj):
        (proj / "docs" / "human-notes.md").write_text("# Just some human doc\nNo frontmatter.\n")
        indexed(proj)
        proc = run(["validate"], proj)
        assert proc.returncode == 0


# ── index ────────────────────────────────────────────────────────────────────

class TestIndex:
    def test_byte_identical_on_unchanged_bundle(self, proj):
        indexed(proj)
        first = (proj / "docs" / "index.md").read_bytes()
        run(["index"], proj, check=True)
        assert (proj / "docs" / "index.md").read_bytes() == first

    def test_row_format(self, proj):
        indexed(proj)
        text = (proj / "docs" / "index.md").read_text()
        assert INDEX_MARKER in text
        assert "- [integer-cents](integer-cents.md) — d (decision, verified)" in text

    def test_new_and_removed_entries_reflected(self, proj):
        indexed(proj)
        write_entry(proj / "docs", "newcomer", trust="generated", date="2026-02-01")
        (proj / "docs" / "repo-pattern.md").unlink()
        run(["index"], proj, check=True)
        text = (proj / "docs" / "index.md").read_text()
        assert "newcomer" in text and "(decision, generated)" in text
        assert "repo-pattern" not in text

    def test_hand_edits_overwritten(self, proj):
        indexed(proj)
        idx = proj / "docs" / "index.md"
        idx.write_text(idx.read_text() + "\n- hand-added row\n")
        run(["index"], proj, check=True)
        assert "hand-added" not in idx.read_text()

    def test_foreign_index_refused(self, proj):
        (proj / "docs" / "index.md").write_text("# Docs site index\nHuman-owned.\n")
        proc = run(["index"], proj)
        assert proc.returncode != 0
        assert "index.md" in proc.stderr
        assert (proj / "docs" / "index.md").read_text().startswith("# Docs site index")


# ── sweep ────────────────────────────────────────────────────────────────────

class TestSweep:
    def test_clean_bundle_empty_report(self, proj):
        indexed(proj)
        data, proc = jrun(["sweep"], proj)
        assert data["stale"] == []

    def test_stale_after_passed_flagged(self, proj):
        write_entry(proj / "docs", "expiring", extra="stale_after: 2026-06-01\n")
        indexed(proj)
        data, _ = jrun(["sweep", "--today", "2026-07-01"], proj)
        assert any(s["file"].endswith("expiring.md") for s in data["stale"])
        data2, _ = jrun(["sweep", "--today", "2026-05-01"], proj)
        assert not any(s["file"].endswith("expiring.md") for s in data2["stale"])

    def test_sources_changed_after_verified_flagged(self, tmp_path):
        p = make_git_repo(tmp_path / "gitproj")
        (p / "_bmad").mkdir()
        (p / "_bmad" / "context.yaml").write_text("project_name: gitproj\nproject_knowledge: docs\n")
        (p / "src").mkdir()
        (p / "src" / "money.py").write_text("CENTS = 1\n")
        make_bundle(p / "docs", entries=())
        write_entry(p / "docs", "drifted", date="2020-01-01",
                    extra="sources: [src/money.py]\n")
        write_entry(p / "docs", "fresh", date="2099-01-01",
                    extra="sources: [src/money.py]\n")
        git(p, "add", "-A")
        git(p, "commit", "-qm", "init")
        run(["index"], p, check=True)
        data, _ = jrun(["sweep"], p)
        files = [s["file"] for s in data["stale"]]
        assert any(f.endswith("drifted.md") for f in files)
        assert not any(f.endswith("fresh.md") for f in files)


# ── compass ──────────────────────────────────────────────────────────────────

class TestCompass:
    def test_nearest_path_selection_with_nesting(self, proj):
        cdir = proj / "docs" / "compass"
        cdir.mkdir()
        (cdir / "src.md").write_text(
            "---\ntype: compass\ntitle: src\ndescription: d\narea: src\nverified: 2026-01-01\n---\nSRC COMPASS\n")
        (cdir / "billing.md").write_text(
            "---\ntype: compass\ntitle: billing\ndescription: d\narea: src/billing\nverified: 2026-01-01\n---\nBILLING COMPASS\n")
        proc = run(["compass", "src/billing/handlers.py"], proj, check=True)
        assert "BILLING COMPASS" in proc.stdout
        proc2 = run(["compass", "src/other/x.py"], proj, check=True)
        assert "SRC COMPASS" in proc2.stdout

    def test_no_compass_empty_exit_0(self, proj):
        proc = run(["compass", "src/anything.py"], proj)
        assert proc.returncode == 0
        assert proc.stdout.strip() == ""


# ── resolve ──────────────────────────────────────────────────────────────────

def make_remote_project(tmp_path, name="payments-api"):
    """A git project with a bundle, plus a bare clone acting as its remote."""
    src = make_git_repo(tmp_path / f"{name}-src")
    make_bundle(src / "docs", entries=("webhook-conventions",))
    git(src, "add", "-A")
    git(src, "commit", "-qm", "init")
    bare = tmp_path / f"{name}.git"
    subprocess.run(["git", "clone", "-q", "--bare", str(src), str(bare)], check=True,
                   capture_output=True)
    return src, bare


def make_obeya(ws, registry: dict):
    ob = ws / "obeya"
    ob.mkdir(parents=True)
    lines = ["bmad_obeya_registry: true", "projects:"]
    for name, rec in registry.items():
        lines.append(f"  {name}:")
        for k, v in rec.items():
            lines.append(f"    {k}: {v}")
    (ob / "registry.yaml").write_text("\n".join(lines) + "\n")
    return ob


class TestResolve:
    @pytest.fixture
    def ws(self, tmp_path):
        """Workspace: proj-a (cwd), sibling checkout, obeya with a remote-only record."""
        ws = tmp_path / "ws"
        a = ws / "proj-a"
        a.mkdir(parents=True)
        make_bundle(a / "docs")
        (a / "_bmad").mkdir()
        (a / "_bmad" / "context.yaml").write_text("project_name: proj-a\nproject_knowledge: docs\n")
        sib = ws / "sibling-api"
        make_bundle(sib / "docs", entries=("sib-entry",))
        _, bare = make_remote_project(tmp_path)
        make_obeya(ws, {
            "payments-api": {"remote": str(bare), "branch": "main", "context_root": "docs"},
            "sibling-api": {"remote": str(tmp_path / "nowhere.git"), "branch": "main",
                            "context_root": "docs"},
        })
        return ws

    def cache_env(self, tmp_path):
        return {"BMAD_CONTEXT_CACHE": str(tmp_path / "cache")}

    def test_rung1_self(self, ws, tmp_path):
        data, _ = jrun(["resolve", "proj-a"], ws / "proj-a")
        assert data["source"] == "local"
        assert Path(data["path"]) == ws / "proj-a" / "docs"

    def test_rung2_workspace_sibling_beats_remote(self, ws, tmp_path):
        data, _ = jrun(["resolve", "sibling-api"], ws / "proj-a")
        assert data["source"] == "local"
        assert Path(data["path"]) == ws / "sibling-api" / "docs"

    def test_rung4_sparse_fetch_pins_sha(self, ws, tmp_path):
        env = self.cache_env(tmp_path)
        proc = run(["--json", "resolve", "payments-api"], ws / "proj-a", env_extra=env)
        assert proc.returncode == 0, proc.stderr
        data = json.loads(proc.stdout)
        assert data["source"] == "remote"
        assert len(data["sha"]) == 40
        fetched = Path(data["path"])
        assert (fetched / "kernel.md").exists()
        assert f"payments-api@{data['sha']}" in str(fetched)

    def test_rung3_cache_hit_after_fetch(self, ws, tmp_path):
        env = self.cache_env(tmp_path)
        run(["--json", "resolve", "payments-api"], ws / "proj-a", env_extra=env, check=True)
        proc = run(["--json", "resolve", "payments-api"], ws / "proj-a", env_extra=env)
        data = json.loads(proc.stdout)
        assert data["source"] == "cache"

    def test_offline_serves_cache_with_warning(self, ws, tmp_path):
        env = self.cache_env(tmp_path)
        run(["--json", "resolve", "payments-api"], ws / "proj-a", env_extra=env, check=True)
        ob_reg = ws / "obeya" / "registry.yaml"
        ob_reg.write_text(ob_reg.read_text().replace("payments-api.git", "gone.git"))
        proc = run(["--json", "resolve", "payments-api", "--refresh"], ws / "proj-a", env_extra=env)
        data = json.loads(proc.stdout)
        assert data["source"] == "cache"
        assert data.get("warning")

    def test_entry_level_resolution(self, ws, tmp_path):
        data, _ = jrun(["resolve", "sibling-api:sib-entry"], ws / "proj-a")
        assert data["path"].endswith("sib-entry.md")

    def test_unresolvable_nonzero_exit(self, ws, tmp_path):
        proc = run(["resolve", "no-such-project"], ws / "proj-a",
                   env_extra=self.cache_env(tmp_path))
        assert proc.returncode != 0

    def test_no_obeya_no_resolver(self, tmp_path):
        lone = tmp_path / "lone"
        lone.mkdir()
        make_bundle(lone / "docs")
        proc = run(["resolve", "anything-remote"], lone,
                   env_extra=self.cache_env(tmp_path))
        assert proc.returncode != 0


# ── sync ─────────────────────────────────────────────────────────────────────

class TestSync:
    def set_placement(self, proj, value):
        cfg = proj / "_bmad" / "context.yaml"
        cfg.write_text(f"project_name: proj\nproject_knowledge: docs\ncontext_placement: {value}\n")

    def test_creates_agents_md_when_absent(self, proj):
        self.set_placement(proj, "agent-files")
        data, _ = jrun(["sync"], proj)
        agents = proj / "AGENTS.md"
        assert agents.exists()
        text = agents.read_text()
        assert BLOCK_START in text and BLOCK_END in text
        assert "Project Kernel" in text

    def test_idempotent_second_run_zero_diff(self, proj):
        self.set_placement(proj, "agent-files")
        jrun(["sync"], proj)
        first = (proj / "AGENTS.md").read_bytes()
        jrun(["sync"], proj)
        assert (proj / "AGENTS.md").read_bytes() == first

    def test_user_content_byte_preserved(self, proj):
        self.set_placement(proj, "agent-files")
        user_text = "# My Agents File\n\nMy own rules — do not touch.\n"
        (proj / "AGENTS.md").write_text(user_text)
        jrun(["sync"], proj)
        text = (proj / "AGENTS.md").read_text()
        assert user_text.rstrip("\n") in text
        assert BLOCK_START in text
        (proj / "docs" / "kernel.md").write_text("# Project Kernel — fixture\n- Updated rule\n")
        jrun(["sync"], proj)
        text2 = (proj / "AGENTS.md").read_text()
        assert user_text.rstrip("\n") in text2
        assert "Updated rule" in text2
        assert text2.count(BLOCK_START) == 1

    def test_compass_nested_agents_files(self, proj):
        self.set_placement(proj, "agent-files")
        cdir = proj / "docs" / "compass"
        cdir.mkdir()
        (cdir / "billing.md").write_text(
            "---\ntype: compass\ntitle: billing\ndescription: d\narea: src/billing\nverified: 2026-01-01\n---\nBILLING COMPASS\n")
        (proj / "src" / "billing").mkdir(parents=True)
        jrun(["sync"], proj)
        nested = proj / "src" / "billing" / "AGENTS.md"
        assert nested.exists() and "BILLING COMPASS" in nested.read_text()

    def test_relative_links_rewritten_to_resolve_from_target(self, proj):
        self.set_placement(proj, "agent-files")
        (proj / "docs" / "kernel.md").write_text(
            "# Project Kernel — fixture\n- Money is cents. Why: [integer-cents](integer-cents.md)\n")
        cdir = proj / "docs" / "compass"
        cdir.mkdir()
        (cdir / "billing.md").write_text(
            "---\ntype: compass\ntitle: billing\ndescription: d\narea: src/billing\nverified: 2026-01-01\n---\n"
            "See [integer-cents](../integer-cents.md) and [kernel](../kernel.md).\n")
        (proj / "src" / "billing").mkdir(parents=True)
        jrun(["sync"], proj)
        root_text = (proj / "AGENTS.md").read_text()
        assert "(docs/integer-cents.md)" in root_text
        assert "(integer-cents.md)" not in root_text.replace("docs/integer-cents.md", "")
        nested = (proj / "src" / "billing" / "AGENTS.md").read_text()
        assert "(../../docs/integer-cents.md)" in nested
        assert "(../../docs/kernel.md)" in nested

    def test_refuses_under_bmad_placement(self, proj):
        self.set_placement(proj, "bmad")
        proc = run(["sync"], proj)
        assert proc.returncode != 0
        assert not (proj / "AGENTS.md").exists()


# ── config ───────────────────────────────────────────────────────────────────

class TestConfig:
    def test_central_toml_chain_with_user_override(self, tmp_path):
        p = tmp_path / "proj"
        (p / "_bmad").mkdir(parents=True)
        (p / "_bmad" / "config.toml").write_text(
            'project_name = "proj"\nproject_knowledge = "docs"\noutput_folder = "_bmad-output"\n')
        (p / "_bmad" / "config.user.toml").write_text('project_knowledge = "knowledge"\n')
        make_bundle(p / "knowledge")
        data, _ = jrun(["config"], p)
        assert data["project_knowledge"] == "knowledge"
        assert data["bundle_root"].endswith("knowledge")

    def test_all_commands_share_the_resolved_root(self, tmp_path):
        p = tmp_path / "proj"
        (p / "_bmad").mkdir(parents=True)
        (p / "_bmad" / "config.toml").write_text('project_knowledge = "docs"\n')
        (p / "_bmad" / "config.user.toml").write_text('project_knowledge = "knowledge"\n')
        make_bundle(p / "knowledge")
        run(["index"], p, check=True)
        assert (p / "knowledge" / "index.md").exists()
        assert not (p / "docs" / "index.md").exists()
        proc = run(["validate"], p)
        assert proc.returncode == 0

    def test_standalone_yaml_fallback_and_defaults(self, proj, tmp_path):
        data, _ = jrun(["config"], proj)
        assert data["project_knowledge"] == "docs"
        bare = tmp_path / "bare"
        bare.mkdir()
        data2, _ = jrun(["config"], bare)
        assert data2["project_knowledge"] == "docs"

    def test_json_accepted_after_subcommand(self, proj):
        indexed(proj)
        proc = run(["validate", "--json"], proj)
        assert proc.returncode == 0
        assert json.loads(proc.stdout)["ok"] is True


# ── sweep: missing sources ───────────────────────────────────────────────────

class TestSweepMissing:
    def test_deleted_source_reported_missing(self, proj):
        write_entry(proj / "docs", "ghost", extra="sources: [src/lib/deleted.ts]\n")
        indexed(proj)
        data, _ = jrun(["sweep"], proj)
        assert any(m["file"].endswith("ghost.md") and "src/lib/deleted.ts" in m["reason"]
                   for m in data["missing"])
        assert data["stale"] == []

    def test_existing_source_not_reported(self, proj):
        (proj / "src" / "lib").mkdir(parents=True)
        (proj / "src" / "lib" / "money.ts").write_text("x")
        write_entry(proj / "docs", "solid", extra="sources: [src/lib/money.ts]\n")
        indexed(proj)
        data, _ = jrun(["sweep"], proj)
        assert not any(m["file"].endswith("solid.md") for m in data["missing"])

    def test_kernel_body_path_gone_reported(self, proj):
        (proj / "src").mkdir(exist_ok=True)
        (proj / "docs" / "kernel.md").write_text(
            "# Project Kernel — fixture\n- Money helpers live in `src/lib/money.ts`\n")
        data, _ = jrun(["sweep"], proj)
        assert any("src/lib/money.ts" in m["reason"] for m in data["missing"])


# ── validate: kernel and size stats ──────────────────────────────────────────

class TestValidateStats:
    def test_oversized_kernel_flagged(self, proj):
        lines = ["# Project Kernel — fixture"] + [f"- rule {i}" for i in range(260)]
        (proj / "docs" / "kernel.md").write_text("\n".join(lines) + "\n")
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("budget" in f["issue"] for f in data["findings"])
        assert data["stats"]["kernel"]["bullets"] == 260

    def test_unknown_kernel_frontmatter_flagged(self, proj):
        (proj / "docs" / "kernel.md").write_text(
            "---\nbogus_key: x\n---\n# Project Kernel — fixture\n- one rule\n")
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("bogus_key" in f["issue"] for f in data["findings"])

    def test_page_length_entry_flagged(self, proj):
        write_entry(proj / "docs", "sprawl", body=("word " * 700).strip())
        indexed(proj)
        data, proc = jrun(["validate"], proj, check=False)
        assert proc.returncode == 1
        assert any("sprawl" in f["file"] and "entries" in f["issue"] for f in data["findings"])

    def test_clean_bundle_still_exit_0_with_stats(self, proj):
        indexed(proj)
        data, proc = jrun(["validate"], proj)
        assert proc.returncode == 0
        assert "kernel" in data["stats"] and "bundle_tokens" in data["stats"]


# ── sync --dry-run ───────────────────────────────────────────────────────────

class TestSyncDryRun:
    def test_dry_run_reports_without_writing(self, proj):
        cfg = proj / "_bmad" / "context.yaml"
        cfg.write_text("project_name: proj\nproject_knowledge: docs\ncontext_placement: agent-files\n")
        data, _ = jrun(["sync", "--dry-run"], proj)
        assert any(w.endswith("AGENTS.md") for w in data["written"])
        assert data["dry_run"] is True
        assert not (proj / "AGENTS.md").exists()


# ── bootstrap & packaging ────────────────────────────────────────────────────

class TestBootstrap:
    def test_copies_self_to_known_spot(self, tmp_path):
        lone = tmp_path / "lone"
        lone.mkdir()
        proc = run(["bootstrap"], lone, check=True)
        target = lone / "_bmad" / "scripts" / "context.py"
        assert target.exists()
        assert target.read_bytes() == CONTEXT_PY.read_bytes()

    def test_idempotent(self, tmp_path):
        lone = tmp_path / "lone"
        lone.mkdir()
        run(["bootstrap"], lone, check=True)
        proc = run(["bootstrap"], lone)
        assert proc.returncode == 0


def test_skill_copy_in_sync_with_core_script():
    skill_copy = (SCRIPTS_DIR.parent / "bmm-skills" / "plan" / "bmad-project-context"
                  / "scripts" / "context.py")
    assert skill_copy.exists(), "skill must ship scripts/context.py (bootstrap source, R10)"
    assert skill_copy.read_bytes() == CONTEXT_PY.read_bytes(), (
        "skill scripts/context.py must be byte-identical to src/scripts/context.py")
