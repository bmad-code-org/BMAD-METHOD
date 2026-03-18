# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml"]
# ///

#!/usr/bin/env python3
"""
BMad Init — Project configuration bootstrap and config loader.

Config files (flat YAML per module):
  - _bmad/core/config.yaml (core settings — user_name, language, output_folder, etc.)
  - _bmad/{module}/config.yaml (module settings + core values merged in)

Usage:
  # Fast path — load all vars for a module (includes core vars)
  python bmad_init.py load --module bmb --all --project-root /path

  # Load specific vars with optional defaults
  python bmad_init.py load --module bmb --vars var1:default1,var2 --project-root /path

  # Load core only
  python bmad_init.py load --all --project-root /path

  # Check if init is needed
  python bmad_init.py check --project-root /path
  python bmad_init.py check --module bmb --skill-path /path/to/skill --project-root /path

  # Resolve module defaults given core answers
  python bmad_init.py resolve-defaults --module bmb --core-answers '{"output_folder":"..."}' --project-root /path

  # Write config from answered questions
  python bmad_init.py write --answers '{"core": {...}, "bmb": {...}}' --project-root /path
"""

import argparse
import json
import os
import sys
from pathlib import Path

import yaml


# =============================================================================
# Project Root Detection
# =============================================================================

def find_project_root(llm_provided=None):
    """
    Find project root by looking for _bmad folder.

    Args:
        llm_provided: Path explicitly provided via --project-root.

    Returns:
        Path to project root, or None if not found.
    """
    if llm_provided:
        candidate = Path(llm_provided)
        if (candidate / '_bmad').exists():
            return candidate
        # First run — _bmad won't exist yet but LLM path is still valid
        if candidate.is_dir():
            return candidate

    for start_dir in [Path.cwd(), Path(__file__).resolve().parent]:
        current_dir = start_dir
        while current_dir != current_dir.parent:
            if (current_dir / '_bmad').exists():
                return current_dir
            current_dir = current_dir.parent

    return None


# =============================================================================
# Module YAML Loading
# =============================================================================

def load_module_yaml(path):
    """
    Load and parse a module.yaml file, separating metadata from variable definitions.

    Returns:
        Dict with 'meta' (code, name, etc.) and 'variables' (var definitions)
        and 'directories' (list of dir templates), or None on failure.
    """
    try:
        with open(path, 'r', encoding='utf-8') as f:
            raw = yaml.safe_load(f)
    except Exception:
        return None

    if not raw or not isinstance(raw, dict):
        return None

    meta_keys = {'code', 'name', 'description', 'default_selected', 'header', 'subheader'}
    meta = {}
    variables = {}
    directories = []

    for key, value in raw.items():
        if key == 'directories':
            directories = value if isinstance(value, list) else []
        elif key in meta_keys:
            meta[key] = value
        elif isinstance(value, dict) and 'prompt' in value:
            variables[key] = value
        # Skip comment-only entries (## var_name lines become None values)

    return {'meta': meta, 'variables': variables, 'directories': directories}


def find_core_module_yaml():
    """Find the core module.yaml bundled with this skill."""
    return Path(__file__).resolve().parent.parent / 'resources' / 'core-module.yaml'


def find_target_module_yaml(module_code, project_root, skill_path=None):
    """
    Find module.yaml for a given module code.

    Search order:
      1. skill_path/assets/module.yaml (calling skill's assets)
      2. skill_path/module.yaml (calling skill's root)
      3. _bmad/{module_code}/module.yaml (installed module location)
    """
    search_paths = []

    if skill_path:
        sp = Path(skill_path)
        search_paths.append(sp / 'assets' / 'module.yaml')
        search_paths.append(sp / 'module.yaml')

    if project_root and module_code:
        search_paths.append(Path(project_root) / '_bmad' / module_code / 'module.yaml')

    for path in search_paths:
        if path.exists():
            return path

    return None


# =============================================================================
# Config Loading (Flat per-module files)
# =============================================================================

def load_config_file(path):
    """Load a flat YAML config file. Returns dict or None."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data if isinstance(data, dict) else None
    except Exception:
        return None


def load_module_config(module_code, project_root):
    """Load config for a specific module from _bmad/{module}/config.yaml."""
    config_path = Path(project_root) / '_bmad' / module_code / 'config.yaml'
    return load_config_file(config_path)


def resolve_project_root_placeholder(value, project_root):
    """Replace {project-root} placeholder with actual path."""
    if not value or not isinstance(value, str):
        return value
    if '{project-root}' in value:
        return value.replace('{project-root}', str(project_root))
    return value


def parse_var_specs(vars_string):
    """
    Parse variable specs: var_name:default_value,var_name2:default_value2
    No default = returns null if missing.
    """
    if not vars_string:
        return []
    specs = []
    for spec in vars_string.split(','):
        spec = spec.strip()
        if not spec:
            continue
        if ':' in spec:
            parts = spec.split(':', 1)
            specs.append({'name': parts[0].strip(), 'default': parts[1].strip()})
        else:
            specs.append({'name': spec, 'default': None})
    return specs


# =============================================================================
# Template Expansion
# =============================================================================

def expand_template(value, context):
    """
    Expand {placeholder} references in a string using context dict.

    Supports: {project-root}, {value}, {output_folder}, {directory_name}, etc.
    """
    if not value or not isinstance(value, str):
        return value
    result = value
    for key, val in context.items():
        placeholder = '{' + key + '}'
        if placeholder in result and val is not None:
            result = result.replace(placeholder, str(val))
    return result


def apply_result_template(var_def, raw_value, context):
    """
    Apply a variable's result template to transform the raw user answer.

    E.g., result: "{project-root}/{value}" with value="_bmad-output"
    becomes "/Users/foo/project/_bmad-output"
    """
    result_template = var_def.get('result')
    if not result_template:
        return raw_value

    ctx = dict(context)
    ctx['value'] = raw_value
    return expand_template(result_template, ctx)


# =============================================================================
# Load Command (Fast Path)
# =============================================================================

def cmd_load(args):
    """Load config vars — the fast path."""
    project_root = find_project_root(llm_provided=args.project_root)
    if not project_root:
        print(json.dumps({'error': 'Project root not found (_bmad folder not detected)'}),
              file=sys.stderr)
        sys.exit(1)

    module_code = args.module or 'core'

    # Load the module's config (which includes core vars)
    config = load_module_config(module_code, project_root)
    if config is None:
        print(json.dumps({
            'init_required': True,
            'missing_module': module_code,
        }), file=sys.stderr)
        sys.exit(1)

    # Resolve {project-root} in all values
    for key in config:
        config[key] = resolve_project_root_placeholder(config[key], project_root)

    if args.all:
        print(json.dumps(config, indent=2))
    else:
        var_specs = parse_var_specs(args.vars)
        if not var_specs:
            print(json.dumps({'error': 'Either --vars or --all must be specified'}),
                  file=sys.stderr)
            sys.exit(1)
        result = {}
        for spec in var_specs:
            val = config.get(spec['name'])
            if val is not None and val != '':
                result[spec['name']] = val
            elif spec['default'] is not None:
                result[spec['name']] = spec['default']
            else:
                result[spec['name']] = None
        print(json.dumps(result, indent=2))


# =============================================================================
# Check Command
# =============================================================================

def cmd_check(args):
    """Check if config exists and return status with module.yaml questions if needed."""
    project_root = find_project_root(llm_provided=args.project_root)
    if not project_root:
        print(json.dumps({
            'status': 'no_project',
            'message': 'No project root found. Provide --project-root to bootstrap.',
        }, indent=2))
        return

    project_root = Path(project_root)
    module_code = args.module

    # Check core config
    core_config = load_module_config('core', project_root)
    core_exists = core_config is not None

    # If no module requested, just check core
    if not module_code or module_code == 'core':
        if core_exists:
            print(json.dumps({'status': 'ready', 'project_root': str(project_root)}, indent=2))
        else:
            core_yaml_path = find_core_module_yaml()
            core_module = load_module_yaml(core_yaml_path) if core_yaml_path.exists() else None
            print(json.dumps({
                'status': 'core_missing',
                'project_root': str(project_root),
                'core_module': core_module,
            }, indent=2))
        return

    # Module requested — check if its config exists
    module_config = load_module_config(module_code, project_root)
    if module_config is not None:
        print(json.dumps({'status': 'ready', 'project_root': str(project_root)}, indent=2))
        return

    # Module config missing — find its module.yaml for questions
    target_yaml_path = find_target_module_yaml(
        module_code, project_root, skill_path=args.skill_path
    )
    target_module = load_module_yaml(target_yaml_path) if target_yaml_path else None

    result = {
        'project_root': str(project_root),
    }

    if not core_exists:
        result['status'] = 'core_missing'
        core_yaml_path = find_core_module_yaml()
        result['core_module'] = load_module_yaml(core_yaml_path) if core_yaml_path.exists() else None
    else:
        result['status'] = 'module_missing'
        result['core_vars'] = core_config

    result['target_module'] = target_module
    if target_yaml_path:
        result['target_module_yaml_path'] = str(target_yaml_path)

    print(json.dumps(result, indent=2))


# =============================================================================
# Resolve Defaults Command
# =============================================================================

def cmd_resolve_defaults(args):
    """Given core answers, resolve a module's variable defaults."""
    project_root = find_project_root(llm_provided=args.project_root)
    if not project_root:
        print(json.dumps({'error': 'Project root not found'}), file=sys.stderr)
        sys.exit(1)

    try:
        core_answers = json.loads(args.core_answers)
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON in --core-answers: {e}'}),
              file=sys.stderr)
        sys.exit(1)

    # Build context for template expansion
    context = {
        'project-root': str(project_root),
        'directory_name': Path(project_root).name,
    }
    context.update(core_answers)

    # Find and load the module's module.yaml
    module_code = args.module
    target_yaml_path = find_target_module_yaml(
        module_code, project_root, skill_path=args.skill_path
    )
    if not target_yaml_path:
        print(json.dumps({'error': f'No module.yaml found for module: {module_code}'}),
              file=sys.stderr)
        sys.exit(1)

    module_def = load_module_yaml(target_yaml_path)
    if not module_def:
        print(json.dumps({'error': f'Failed to parse module.yaml at: {target_yaml_path}'}),
              file=sys.stderr)
        sys.exit(1)

    # Resolve defaults in each variable
    resolved_vars = {}
    for var_name, var_def in module_def['variables'].items():
        default = var_def.get('default', '')
        resolved_default = expand_template(str(default), context)
        resolved_vars[var_name] = dict(var_def)
        resolved_vars[var_name]['default'] = resolved_default

    result = {
        'module_code': module_code,
        'meta': module_def['meta'],
        'variables': resolved_vars,
        'directories': module_def['directories'],
    }
    print(json.dumps(result, indent=2))


# =============================================================================
# Write Command
# =============================================================================

def cmd_write(args):
    """Write config files from answered questions."""
    project_root = find_project_root(llm_provided=args.project_root)
    if not project_root:
        if args.project_root:
            project_root = Path(args.project_root)
        else:
            print(json.dumps({'error': 'Project root not found and --project-root not provided'}),
                  file=sys.stderr)
            sys.exit(1)

    project_root = Path(project_root)

    try:
        answers = json.loads(args.answers)
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON in --answers: {e}'}),
              file=sys.stderr)
        sys.exit(1)

    context = {
        'project-root': str(project_root),
        'directory_name': project_root.name,
    }

    # Load module.yaml definitions to get result templates
    core_yaml_path = find_core_module_yaml()
    core_def = load_module_yaml(core_yaml_path) if core_yaml_path.exists() else None

    files_written = []
    dirs_created = []

    # Process core answers first (needed for module config expansion)
    core_answers_raw = answers.get('core', {})
    core_config = {}

    if core_answers_raw and core_def:
        for var_name, raw_value in core_answers_raw.items():
            var_def = core_def['variables'].get(var_name, {})
            expanded = apply_result_template(var_def, raw_value, context)
            core_config[var_name] = expanded

        # Write core config
        core_dir = project_root / '_bmad' / 'core'
        core_dir.mkdir(parents=True, exist_ok=True)
        core_config_path = core_dir / 'config.yaml'

        # Merge with existing if present
        existing = load_config_file(core_config_path) or {}
        existing.update(core_config)

        _write_config_file(core_config_path, existing, 'CORE')
        files_written.append(str(core_config_path))
    elif core_answers_raw:
        # No core_def available — write raw values
        core_config = dict(core_answers_raw)
        core_dir = project_root / '_bmad' / 'core'
        core_dir.mkdir(parents=True, exist_ok=True)
        core_config_path = core_dir / 'config.yaml'
        existing = load_config_file(core_config_path) or {}
        existing.update(core_config)
        _write_config_file(core_config_path, existing, 'CORE')
        files_written.append(str(core_config_path))

    # Update context with resolved core values for module expansion
    context.update(core_config)

    # Process module answers
    for module_code, module_answers_raw in answers.items():
        if module_code == 'core':
            continue

        # Find module.yaml for result templates
        target_yaml_path = find_target_module_yaml(
            module_code, project_root, skill_path=args.skill_path
        )
        module_def = load_module_yaml(target_yaml_path) if target_yaml_path else None

        # Build module config: start with core values, then add module values
        # Re-read core config to get the latest (may have been updated above)
        latest_core = load_module_config('core', project_root) or core_config
        module_config = dict(latest_core)

        for var_name, raw_value in module_answers_raw.items():
            if module_def:
                var_def = module_def['variables'].get(var_name, {})
                expanded = apply_result_template(var_def, raw_value, context)
            else:
                expanded = raw_value
            module_config[var_name] = expanded
            context[var_name] = expanded  # Available for subsequent template expansion

        # Write module config
        module_dir = project_root / '_bmad' / module_code
        module_dir.mkdir(parents=True, exist_ok=True)
        module_config_path = module_dir / 'config.yaml'

        existing = load_config_file(module_config_path) or {}
        existing.update(module_config)

        module_name = module_def['meta'].get('name', module_code.upper()) if module_def else module_code.upper()
        _write_config_file(module_config_path, existing, module_name)
        files_written.append(str(module_config_path))

        # Create directories declared in module.yaml
        if module_def and module_def.get('directories'):
            for dir_template in module_def['directories']:
                dir_path = expand_template(dir_template, context)
                if dir_path:
                    Path(dir_path).mkdir(parents=True, exist_ok=True)
                    dirs_created.append(dir_path)

    result = {
        'status': 'written',
        'files_written': files_written,
        'dirs_created': dirs_created,
    }
    print(json.dumps(result, indent=2))


def _write_config_file(path, data, module_label):
    """Write a config YAML file with a header comment."""
    from datetime import datetime, timezone
    with open(path, 'w', encoding='utf-8') as f:
        f.write(f'# {module_label} Module Configuration\n')
        f.write(f'# Generated by bmad-init\n')
        f.write(f'# Date: {datetime.now(timezone.utc).isoformat()}\n\n')
        yaml.safe_dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)


# =============================================================================
# CLI Entry Point
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='BMad Init — Project configuration bootstrap and config loader.'
    )
    subparsers = parser.add_subparsers(dest='command')

    # --- load ---
    load_parser = subparsers.add_parser('load', help='Load config vars (fast path)')
    load_parser.add_argument('--module', help='Module code (omit for core only)')
    load_parser.add_argument('--vars', help='Comma-separated vars with optional defaults')
    load_parser.add_argument('--all', action='store_true', help='Return all config vars')
    load_parser.add_argument('--project-root', help='Project root path')

    # --- check ---
    check_parser = subparsers.add_parser('check', help='Check if init is needed')
    check_parser.add_argument('--module', help='Module code to check (optional)')
    check_parser.add_argument('--skill-path', help='Path to the calling skill folder')
    check_parser.add_argument('--project-root', help='Project root path')

    # --- resolve-defaults ---
    resolve_parser = subparsers.add_parser('resolve-defaults',
                                           help='Resolve module defaults given core answers')
    resolve_parser.add_argument('--module', required=True, help='Module code')
    resolve_parser.add_argument('--core-answers', required=True, help='JSON string of core answers')
    resolve_parser.add_argument('--skill-path', help='Path to calling skill folder')
    resolve_parser.add_argument('--project-root', help='Project root path')

    # --- write ---
    write_parser = subparsers.add_parser('write', help='Write config files')
    write_parser.add_argument('--answers', required=True, help='JSON string of all answers')
    write_parser.add_argument('--skill-path', help='Path to calling skill (for module.yaml lookup)')
    write_parser.add_argument('--project-root', help='Project root path')

    args = parser.parse_args()
    if args.command is None:
        parser.print_help()
        sys.exit(1)

    commands = {
        'load': cmd_load,
        'check': cmd_check,
        'resolve-defaults': cmd_resolve_defaults,
        'write': cmd_write,
    }

    handler = commands.get(args.command)
    if handler:
        handler(args)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
