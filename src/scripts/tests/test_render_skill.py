import contextlib
import importlib.util
import secrets
import shutil
import sys
import unittest
from pathlib import Path
from unittest import mock


SCRIPTS_DIR = Path(__file__).resolve().parents[1]
MODULE_PATH = SCRIPTS_DIR / "render_skill.py"
ORIGINAL_SYS_PATH = sys.path.copy()
try:
    if str(SCRIPTS_DIR) not in sys.path:
        sys.path.insert(0, str(SCRIPTS_DIR))
    SPEC = importlib.util.spec_from_file_location("bmad_render_skill", MODULE_PATH)
    if SPEC is None or SPEC.loader is None:
        raise RuntimeError(f"failed to load renderer module from {MODULE_PATH}")
    render_skill = importlib.util.module_from_spec(SPEC)
    SPEC.loader.exec_module(render_skill)
finally:
    sys.path[:] = ORIGINAL_SYS_PATH


@contextlib.contextmanager
def writable_test_directory():
    """Create a test directory that inherits the checkout's writable Windows ACL."""
    path = Path(__file__).resolve().parent / f".test-{secrets.token_hex(8)}"
    path.mkdir()
    try:
        yield path
    finally:
        shutil.rmtree(path)


class CreateStagingDirectoryTests(unittest.TestCase):
    def test_windows_creates_inheritable_randomized_child(self):
        with writable_test_directory() as parent:
            with (
                mock.patch.object(render_skill.sys, "platform", "win32"),
                mock.patch.object(
                    render_skill.secrets, "token_hex", return_value="abc123"
                ) as token_hex,
                mock.patch.object(
                    render_skill.tempfile,
                    "mkdtemp",
                    side_effect=AssertionError("Windows must not use tempfile.mkdtemp"),
                ),
            ):
                staging = render_skill._create_staging_directory(parent)
                probe = staging / "nested" / "probe.txt"
                probe.parent.mkdir()
                probe.write_text("writable", encoding="utf-8")

            self.assertEqual(staging, parent / ".staging-abc123")
            self.assertEqual(probe.read_text(encoding="utf-8"), "writable")
            token_hex.assert_called_once_with(8)

    def test_non_windows_delegates_to_mkdtemp(self):
        parent = Path("parent")
        created = "parent/.staging-created"
        with (
            mock.patch.object(render_skill.sys, "platform", "linux"),
            mock.patch.object(
                render_skill.tempfile, "mkdtemp", return_value=created
            ) as mkdtemp,
        ):
            staging = render_skill._create_staging_directory(parent)

        self.assertEqual(staging, Path(created))
        mkdtemp.assert_called_once_with(prefix=".staging-", dir=parent)

    def test_windows_retries_collision_without_altering_existing_path(self):
        with writable_test_directory() as parent:
            collision = parent / ".staging-collision"
            collision.mkdir()
            marker = collision / "marker.txt"
            marker.write_text("untouched", encoding="utf-8")
            with (
                mock.patch.object(render_skill.sys, "platform", "win32"),
                mock.patch.object(
                    render_skill.secrets,
                    "token_hex",
                    side_effect=["collision", "available"],
                ),
            ):
                staging = render_skill._create_staging_directory(parent)

            self.assertEqual(staging, parent / ".staging-available")
            self.assertEqual(marker.read_text(encoding="utf-8"), "untouched")

    def test_windows_reports_collision_exhaustion(self):
        with writable_test_directory() as parent:
            collision = parent / ".staging-collision"
            collision.mkdir()
            with (
                mock.patch.object(render_skill.sys, "platform", "win32"),
                mock.patch.object(
                    render_skill.secrets, "token_hex", return_value="collision"
                ) as token_hex,
            ):
                with self.assertRaisesRegex(
                    render_skill.RenderError, "16 name collisions"
                ):
                    render_skill._create_staging_directory(parent)

            self.assertEqual(
                token_hex.call_count, render_skill._WINDOWS_STAGING_ATTEMPTS
            )
            self.assertTrue(collision.is_dir())

    def test_windows_propagates_unexpected_creation_error(self):
        with writable_test_directory() as parent:
            missing_parent = parent / "missing"
            with (
                mock.patch.object(render_skill.sys, "platform", "win32"),
                mock.patch.object(render_skill.secrets, "token_hex", return_value="x"),
            ):
                with self.assertRaises(FileNotFoundError):
                    render_skill._create_staging_directory(missing_parent)


if __name__ == "__main__":
    unittest.main()
