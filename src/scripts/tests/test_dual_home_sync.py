#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""The dual-homed scripts must stay byte-identical between src/scripts/ and the
skill's bundled copies. This test works from either home and skips when the
sibling home is absent (e.g. post-install)."""

import unittest
from pathlib import Path

SCRIPTS = ("update_ticket.py", "ticket_tree.py")


def find_src_root(start):
    for parent in start.resolve().parents:
        if parent.name == "src" and (parent / "scripts").is_dir() \
                and (parent / "bmm-skills").is_dir():
            return parent
    return None


class DualHomeSyncTests(unittest.TestCase):
    def test_copies_are_byte_identical(self):
        src = find_src_root(Path(__file__))
        if src is None:
            self.skipTest("sibling home not present (installed layout)")
        canonical = src / "scripts"
        bundled = src / "bmm-skills" / "plan" / "bmad-ticket" / "scripts"
        for name in SCRIPTS:
            a, b = canonical / name, bundled / name
            if not (a.is_file() and b.is_file()):
                self.skipTest(f"{name} missing from one home")
            self.assertEqual(a.read_bytes(), b.read_bytes(),
                             f"{name} has drifted between src/scripts and the bundled copy")


if __name__ == "__main__":
    unittest.main()
