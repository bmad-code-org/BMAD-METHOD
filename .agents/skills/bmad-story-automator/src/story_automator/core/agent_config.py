from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .common import ensure_dir, file_exists, iso_now, read_text, write_atomic
from .frontmatter import find_frontmatter_value
from .runtime_layout import runtime_provider


@dataclass
class AgentTaskConfig:
    primary: str = ""
    fallback: Any = None


@dataclass
class AgentConfigResolved:
    default_primary: str = "auto"
    default_fallback: str = "false"
    per_task: dict[str, AgentTaskConfig] = field(default_factory=dict)
    complexity_overrides: dict[str, dict[str, AgentTaskConfig]] = field(default_factory=dict)


def load_presets_file(path: str | Path) -> dict[str, Any]:
    preset_path = Path(path)
    if not file_exists(preset_path):
        return {"version": "1.0.0", "presets": []}
    data = json.loads(read_text(preset_path))
    data.setdefault("version", "1.0.0")
    data.setdefault("presets", [])
    return data


def save_presets_file(path: str | Path, data: dict[str, Any]) -> None:
    ensure_dir(Path(path).parent)
    write_atomic(path, json.dumps(data, indent=2) + "\n")


def parse_agent_config_json(raw: str) -> AgentConfigResolved:
    data = json.loads(raw)
    config = AgentConfigResolved()
    config.default_primary = data.get("defaultPrimary") or data.get("primary") or "auto"
    if "defaultFallback" in data:
        fallback_raw = data.get("defaultFallback")
    elif "fallback" in data:
        fallback_raw = data.get("fallback")
    else:
        fallback_raw = False
    normalized_fallback = normalize_fallback_value(fallback_raw)
    config.default_fallback = normalized_fallback or "false"
    config.per_task = _parse_task_map(data.get("perTask"))
    retro_task = _parse_task_entry(data.get("retro"))
    if retro_task is not None:
        config.per_task.setdefault("retro", retro_task)
    for level, value in (data.get("complexityOverrides") or {}).items():
        config.complexity_overrides[level] = _parse_task_map(value)
    for level in ("low", "medium", "high"):
        if level not in config.complexity_overrides and level in data:
            parsed = _parse_task_map(data[level])
            if parsed:
                config.complexity_overrides[level] = parsed
    return config


def _parse_task_map(raw: Any) -> dict[str, AgentTaskConfig]:
    if not isinstance(raw, dict):
        return {}
    output: dict[str, AgentTaskConfig] = {}
    for task, entry in raw.items():
        parsed = _parse_task_entry(entry)
        if parsed is None:
            continue
        output[task] = parsed
    return output


def _parse_task_entry(raw: Any) -> AgentTaskConfig | None:
    if not isinstance(raw, dict):
        return None
    return AgentTaskConfig(primary=str(raw.get("primary", "")), fallback=raw.get("fallback"))


def normalize_fallback_value(raw: Any) -> str:
    if isinstance(raw, str):
        lower = raw.strip().lower()
        if lower in {"false", "none", "null"}:
            return "false"
        return lower
    if isinstance(raw, bool):
        return "true" if raw else "false"
    return ""


def resolve_agent_for_task(config: AgentConfigResolved, complexity: str, task: str) -> tuple[str, str]:
    primary = config.default_primary or "auto"
    fallback = config.default_fallback or "false"
    per_task = config.per_task.get(task)
    if per_task:
        if per_task.primary:
            primary = per_task.primary
        if per_task.fallback is not None:
            fallback = normalize_fallback_value(per_task.fallback)
    by_level = config.complexity_overrides.get(complexity, {})
    override = by_level.get(task)
    if override:
        if override.primary:
            primary = override.primary
        if override.fallback is not None:
            fallback = normalize_fallback_value(override.fallback)
    return _resolve_primary_agent(primary), _resolve_fallback_agent(fallback)


def _resolve_primary_agent(raw: Any) -> str:
    value = str(raw or "").strip().lower()
    if value in {"", "auto", "runtime"}:
        return runtime_provider()
    return value


def _resolve_fallback_agent(raw: Any) -> str:
    value = normalize_fallback_value(raw)
    normalized = str(value).strip().lower()
    if normalized in {"", "auto", "runtime"}:
        return "false"
    return normalized


def extract_json_block(text: str) -> str:
    match = re.search(r"(?s)```json\s*(\{.*?\})\s*```", text)
    if match:
        return match.group(1)
    stripped = text.strip()
    if stripped.startswith("{") and stripped.endswith("}"):
        return stripped
    return ""


def build_agents_file(state_file: str | Path, complexity_file: str | Path, output_path: str | Path, config_json: str) -> dict[str, Any]:
    config = parse_agent_config_json(config_json)
    complexity_payload = json.loads(read_text(complexity_file))
    stories = []
    for story in complexity_payload.get("stories", []):
        level = str(((story.get("complexity") or {}).get("level")) or "medium").strip().lower() or "medium"
        tasks = {}
        for task in ("create", "dev", "auto", "review"):
            primary, fallback = resolve_agent_for_task(config, level, task)
            tasks[task] = {"primary": primary, "fallback": False if fallback == "false" else fallback}
        stories.append(
            {
                "storyId": story.get("storyId"),
                "title": story.get("title"),
                "complexity": level,
                "tasks": tasks,
            }
        )
    payload = {
        "version": "1.0.0",
        "stateFile": str(state_file),
        "epic": find_frontmatter_value(state_file, "epic"),
        "epicName": find_frontmatter_value(state_file, "epicName"),
        "createdAt": iso_now(),
        "stories": stories,
    }
    header = (
        f"---\nstateFile: {json.dumps(str(state_file))}\ncreatedAt: {json.dumps(payload['createdAt'])}\n---\n\n"
        f"# Agents Plan: {payload['epicName']}\n\n```json\n{json.dumps(payload, indent=2)}\n```\n"
    )
    ensure_dir(Path(output_path).parent)
    write_atomic(output_path, header)
    return {"ok": True, "path": str(output_path), "stories": len(stories)}


def resolve_agents(agents_file: str | Path, story_id: str, task: str) -> dict[str, Any]:
    text = read_text(agents_file)
    block = extract_json_block(text)
    if not block:
        return {"ok": False, "error": "agents_json_missing"}
    payload = json.loads(block)
    for story in payload.get("stories", []):
        if story.get("storyId") != story_id:
            continue
        selection = (story.get("tasks") or {}).get(task)
        if not selection:
            return {"ok": False, "error": "task_not_found"}
        fallback = normalize_fallback_value(selection.get("fallback"))
        return {
            "ok": True,
            "story": story_id,
            "task": task,
            "primary": selection.get("primary"),
            "fallback": fallback,
            "complexity": story.get("complexity"),
        }
    return {"ok": False, "error": "story_not_found"}
