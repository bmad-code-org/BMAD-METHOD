import sys
import tempfile
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config_utils import (  # noqa: E402
    ConfigError,
    load_central_config,
    load_customization,
    load_toml,
    structural_merge,
)


class ConfigUtilsTests(unittest.TestCase):
    def test_structural_merge_recurses_appends_and_replaces_keyed_tables(self):
        base = {
            "nested": {"keep": True, "replace": "old"},
            "plain": ["base"],
            "items": [{"id": "one", "value": "old"}],
        }
        override = {
            "nested": {"replace": "new"},
            "plain": ["override"],
            "items": [
                {"id": "one", "value": "new"},
                {"id": "two", "value": "added"},
            ],
        }

        merged = structural_merge(base, override)

        self.assertEqual(merged["nested"], {"keep": True, "replace": "new"})
        self.assertEqual(merged["plain"], ["base", "override"])
        self.assertEqual(
            merged["items"],
            [
                {"id": "one", "value": "new"},
                {"id": "two", "value": "added"},
            ],
        )

    def test_non_string_keyed_identifier_falls_back_to_append(self):
        # A candidate whose values are inconsistently typed across items must
        # disqualify that candidate (not raise) and, with no other candidate
        # available, fall back to append semantics.
        merged = structural_merge([{"id": "valid"}], [{"id": 42}])

        self.assertEqual(merged, [{"id": "valid"}, {"id": 42}])

    def test_non_string_candidate_skips_to_next_valid_candidate(self):
        # `code` is present on every item but not a string; the detector
        # must move on to `id`, which is present, string, and non-empty
        # on every item, and use it as the merge key.
        base = [{"code": 200, "id": "ok", "value": "old"}]
        override = [{"code": 200, "id": "ok", "value": "new"}]

        merged = structural_merge(base, override)

        self.assertEqual(merged, [{"code": 200, "id": "ok", "value": "new"}])

    def test_non_string_code_values_across_all_items_fall_back_to_append(self):
        # Regression test for #2721: a keyed array of tables (e.g.
        # HTTP-status tables) where every item shares a non-string `code`
        # field, and no other candidate qualifies, must not raise — it
        # must fall back to append-merge like pre-6.11 behavior.
        base = [{"code": 200, "description": "OK"}]
        override = [{"code": 404, "description": "Not Found"}]

        merged = structural_merge(base, override)

        self.assertEqual(
            merged,
            [
                {"code": 200, "description": "OK"},
                {"code": 404, "description": "Not Found"},
            ],
        )

    def test_present_malformed_optional_layer_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "optional.toml"
            path.write_text("[broken\n", encoding="utf-8")

            with self.assertRaisesRegex(ConfigError, "failed to parse"):
                load_toml(path)

    def test_missing_optional_layer_is_empty(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "optional.toml"

            self.assertEqual(load_toml(path), {})

    def test_filesystem_layer_precedence(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            bmad = root / "_bmad"
            custom = bmad / "custom"
            skill = bmad / "bmm" / "sample-skill"
            custom.mkdir(parents=True)
            skill.mkdir(parents=True)
            (bmad / "config.toml").write_text('[value]\norder = "base-team"\n', encoding="utf-8")
            (bmad / "config.user.toml").write_text('[value]\norder = "base-user"\n', encoding="utf-8")
            (custom / "config.toml").write_text('[value]\norder = "custom-team"\n', encoding="utf-8")
            (custom / "config.user.toml").write_text('[value]\norder = "custom-user"\n', encoding="utf-8")
            (skill / "customize.toml").write_text('[value]\norder = "default"\n', encoding="utf-8")
            (custom / "sample-skill.toml").write_text('[value]\norder = "team"\n', encoding="utf-8")
            (custom / "sample-skill.user.toml").write_text('[value]\norder = "user"\n', encoding="utf-8")

            self.assertEqual(load_central_config(root)["value"]["order"], "custom-user")
            self.assertEqual(load_customization(root, skill)["value"]["order"], "user")


if __name__ == "__main__":
    unittest.main()
