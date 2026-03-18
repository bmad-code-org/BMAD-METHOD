# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml"]
# ///

#!/usr/bin/env python3
"""Unit tests for bmad_init.py"""

import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from bmad_init import (
    find_project_root,
    parse_var_specs,
    resolve_project_root_placeholder,
    expand_template,
    apply_result_template,
    load_module_yaml,
    find_core_module_yaml,
    find_target_module_yaml,
    load_config_file,
    load_module_config,
)


class TestFindProjectRoot(unittest.TestCase):

    def test_finds_bmad_folder(self):
        temp_dir = tempfile.mkdtemp()
        try:
            (Path(temp_dir) / '_bmad').mkdir()
            original_cwd = os.getcwd()
            try:
                os.chdir(temp_dir)
                result = find_project_root()
                self.assertEqual(result.resolve(), Path(temp_dir).resolve())
            finally:
                os.chdir(original_cwd)
        finally:
            shutil.rmtree(temp_dir)

    def test_llm_provided_with_bmad(self):
        temp_dir = tempfile.mkdtemp()
        try:
            (Path(temp_dir) / '_bmad').mkdir()
            result = find_project_root(llm_provided=temp_dir)
            self.assertEqual(result.resolve(), Path(temp_dir).resolve())
        finally:
            shutil.rmtree(temp_dir)

    def test_llm_provided_without_bmad_still_returns_dir(self):
        """First-run case: LLM provides path but _bmad doesn't exist yet."""
        temp_dir = tempfile.mkdtemp()
        try:
            result = find_project_root(llm_provided=temp_dir)
            self.assertEqual(result.resolve(), Path(temp_dir).resolve())
        finally:
            shutil.rmtree(temp_dir)


class TestParseVarSpecs(unittest.TestCase):

    def test_vars_with_defaults(self):
        specs = parse_var_specs('var1:value1,var2:value2')
        self.assertEqual(len(specs), 2)
        self.assertEqual(specs[0]['name'], 'var1')
        self.assertEqual(specs[0]['default'], 'value1')

    def test_vars_without_defaults(self):
        specs = parse_var_specs('var1,var2')
        self.assertEqual(len(specs), 2)
        self.assertIsNone(specs[0]['default'])

    def test_mixed_vars(self):
        specs = parse_var_specs('required_var,var2:default2')
        self.assertIsNone(specs[0]['default'])
        self.assertEqual(specs[1]['default'], 'default2')

    def test_colon_in_default(self):
        specs = parse_var_specs('path:{project-root}/some/path')
        self.assertEqual(specs[0]['default'], '{project-root}/some/path')

    def test_empty_string(self):
        self.assertEqual(parse_var_specs(''), [])

    def test_none(self):
        self.assertEqual(parse_var_specs(None), [])


class TestResolveProjectRootPlaceholder(unittest.TestCase):

    def test_resolve_placeholder(self):
        result = resolve_project_root_placeholder('{project-root}/output', Path('/test'))
        self.assertEqual(result, '/test/output')

    def test_no_placeholder(self):
        result = resolve_project_root_placeholder('/absolute/path', Path('/test'))
        self.assertEqual(result, '/absolute/path')

    def test_none(self):
        self.assertIsNone(resolve_project_root_placeholder(None, Path('/test')))

    def test_non_string(self):
        self.assertEqual(resolve_project_root_placeholder(42, Path('/test')), 42)


class TestExpandTemplate(unittest.TestCase):

    def test_basic_expansion(self):
        result = expand_template('{project-root}/output', {'project-root': '/test'})
        self.assertEqual(result, '/test/output')

    def test_multiple_placeholders(self):
        result = expand_template(
            '{output_folder}/planning',
            {'output_folder': '_bmad-output', 'project-root': '/test'}
        )
        self.assertEqual(result, '_bmad-output/planning')

    def test_none_value(self):
        self.assertIsNone(expand_template(None, {}))

    def test_non_string(self):
        self.assertEqual(expand_template(42, {}), 42)


class TestApplyResultTemplate(unittest.TestCase):

    def test_with_result_template(self):
        var_def = {'result': '{project-root}/{value}'}
        result = apply_result_template(var_def, '_bmad-output', {'project-root': '/test'})
        self.assertEqual(result, '/test/_bmad-output')

    def test_without_result_template(self):
        result = apply_result_template({}, 'raw_value', {})
        self.assertEqual(result, 'raw_value')

    def test_value_only_template(self):
        var_def = {'result': '{value}'}
        result = apply_result_template(var_def, 'English', {})
        self.assertEqual(result, 'English')


class TestLoadModuleYaml(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_loads_core_module_yaml(self):
        path = Path(self.temp_dir) / 'module.yaml'
        path.write_text(
            'code: core\n'
            'name: "BMad Core Module"\n'
            'header: "Core Config"\n'
            'user_name:\n'
            '  prompt: "What should agents call you?"\n'
            '  default: "BMad"\n'
            '  result: "{value}"\n'
        )
        result = load_module_yaml(path)
        self.assertIsNotNone(result)
        self.assertEqual(result['meta']['code'], 'core')
        self.assertEqual(result['meta']['name'], 'BMad Core Module')
        self.assertIn('user_name', result['variables'])
        self.assertEqual(result['variables']['user_name']['prompt'], 'What should agents call you?')

    def test_loads_module_with_directories(self):
        path = Path(self.temp_dir) / 'module.yaml'
        path.write_text(
            'code: bmm\n'
            'name: "BMad Method"\n'
            'project_name:\n'
            '  prompt: "Project name?"\n'
            '  default: "{directory_name}"\n'
            '  result: "{value}"\n'
            'directories:\n'
            '  - "{planning_artifacts}"\n'
        )
        result = load_module_yaml(path)
        self.assertEqual(result['directories'], ['{planning_artifacts}'])

    def test_returns_none_for_missing(self):
        result = load_module_yaml(Path(self.temp_dir) / 'nonexistent.yaml')
        self.assertIsNone(result)

    def test_returns_none_for_empty(self):
        path = Path(self.temp_dir) / 'empty.yaml'
        path.write_text('')
        result = load_module_yaml(path)
        self.assertIsNone(result)


class TestFindCoreModuleYaml(unittest.TestCase):

    def test_returns_path_to_resources(self):
        path = find_core_module_yaml()
        self.assertTrue(str(path).endswith('resources/core-module.yaml'))


class TestFindTargetModuleYaml(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.project_root = Path(self.temp_dir)

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_finds_in_skill_assets(self):
        skill_path = self.project_root / 'skills' / 'test-skill'
        assets = skill_path / 'assets'
        assets.mkdir(parents=True)
        (assets / 'module.yaml').write_text('code: test\n')

        result = find_target_module_yaml('test', self.project_root, str(skill_path))
        self.assertIsNotNone(result)
        self.assertTrue(str(result).endswith('assets/module.yaml'))

    def test_finds_in_skill_root(self):
        skill_path = self.project_root / 'skills' / 'test-skill'
        skill_path.mkdir(parents=True)
        (skill_path / 'module.yaml').write_text('code: test\n')

        result = find_target_module_yaml('test', self.project_root, str(skill_path))
        self.assertIsNotNone(result)

    def test_finds_in_bmad_module_dir(self):
        module_dir = self.project_root / '_bmad' / 'mymod'
        module_dir.mkdir(parents=True)
        (module_dir / 'module.yaml').write_text('code: mymod\n')

        result = find_target_module_yaml('mymod', self.project_root)
        self.assertIsNotNone(result)

    def test_returns_none_when_not_found(self):
        result = find_target_module_yaml('missing', self.project_root)
        self.assertIsNone(result)

    def test_skill_path_takes_priority(self):
        """Skill assets module.yaml takes priority over _bmad/{module}/."""
        skill_path = self.project_root / 'skills' / 'test-skill'
        assets = skill_path / 'assets'
        assets.mkdir(parents=True)
        (assets / 'module.yaml').write_text('code: test\nname: from-skill\n')

        module_dir = self.project_root / '_bmad' / 'test'
        module_dir.mkdir(parents=True)
        (module_dir / 'module.yaml').write_text('code: test\nname: from-bmad\n')

        result = find_target_module_yaml('test', self.project_root, str(skill_path))
        self.assertTrue('assets' in str(result))


class TestLoadConfigFile(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_loads_flat_yaml(self):
        path = Path(self.temp_dir) / 'config.yaml'
        path.write_text('user_name: Test\ncommunication_language: English\n')
        result = load_config_file(path)
        self.assertEqual(result['user_name'], 'Test')

    def test_returns_none_for_missing(self):
        result = load_config_file(Path(self.temp_dir) / 'missing.yaml')
        self.assertIsNone(result)


class TestLoadModuleConfig(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.project_root = Path(self.temp_dir)
        bmad_core = self.project_root / '_bmad' / 'core'
        bmad_core.mkdir(parents=True)
        (bmad_core / 'config.yaml').write_text(
            'user_name: TestUser\n'
            'communication_language: English\n'
            'document_output_language: English\n'
            'output_folder: "{project-root}/_bmad-output"\n'
        )
        bmad_bmb = self.project_root / '_bmad' / 'bmb'
        bmad_bmb.mkdir(parents=True)
        (bmad_bmb / 'config.yaml').write_text(
            'user_name: TestUser\n'
            'communication_language: English\n'
            'document_output_language: English\n'
            'output_folder: "{project-root}/_bmad-output"\n'
            'bmad_builder_output_folder: "{project-root}/_bmad-output/skills"\n'
            'bmad_builder_reports: "{project-root}/_bmad-output/reports"\n'
        )

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_load_core(self):
        result = load_module_config('core', self.project_root)
        self.assertIsNotNone(result)
        self.assertEqual(result['user_name'], 'TestUser')

    def test_load_module_includes_core_vars(self):
        result = load_module_config('bmb', self.project_root)
        self.assertIsNotNone(result)
        # Module-specific var
        self.assertIn('bmad_builder_output_folder', result)
        # Core vars also present
        self.assertEqual(result['user_name'], 'TestUser')

    def test_missing_module(self):
        result = load_module_config('nonexistent', self.project_root)
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
