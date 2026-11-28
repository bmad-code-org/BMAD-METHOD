"""Tests for tools/validate_csvs.py."""

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT = REPO_ROOT / "tools" / "validate_csvs.py"
_SPEC = importlib.util.spec_from_file_location("validate_csvs", SCRIPT)
validator = importlib.util.module_from_spec(_SPEC)
sys.modules["validate_csvs"] = validator
_SPEC.loader.exec_module(validator)


class TestValidateCsvs(unittest.TestCase):
    def test_live_skills_tree_passes(self) -> None:
        self.assertEqual(validator.main(["--root", str(REPO_ROOT / "skills"), "--strict"]), 0)

    def test_valid_and_broken_csv_cases(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            ok_catalog = root / "doc-templates" / "methods-sample.csv"
            ok_catalog.parent.mkdir(parents=True)
            ok_catalog.write_text(
                'category,name,key_questions\nsec,Injection,"Where does input land?|Is it parameterized?"\n',
                encoding="utf-8",
            )
            self.assertEqual(validator.validate_csv_file(ok_catalog, "doc-templates/methods-sample.csv"), [])

            # Unquoted comma causes ragged row.
            ragged = root / "ragged.csv"
            ragged.write_text("a,b\n1,two,three\n", encoding="utf-8")
            self.assertTrue(any("expected 2 columns" in f for f in validator.validate_csv_file(ragged, "ragged.csv")))

            # Unclosed quote caught cleanly.
            unclosed = root / "unclosed.csv"
            unclosed.write_text('a,b\n1,"unterminated\n', encoding="utf-8")
            self.assertTrue(any("CSV parse error" in f for f in validator.validate_csv_file(unclosed, "unclosed.csv")))

            # Duplicate key name caught.
            dup_key = root / "assets" / "methods.csv"
            dup_key.parent.mkdir(parents=True)
            dup_key.write_text("name,val\nAlpha,1\nAlpha,2\n", encoding="utf-8")
            self.assertTrue(
                any("duplicate 'name'" in f for f in validator.validate_csv_file(dup_key, "assets/methods.csv"))
            )

            # Blank row and duplicate header caught.
            bad_hdr = root / "bad_hdr.csv"
            bad_hdr.write_text("col,col\n\n", encoding="utf-8")
            hdr_findings = validator.validate_csv_file(bad_hdr, "bad_hdr.csv")
            self.assertTrue(any("duplicate column names" in f for f in hdr_findings))
            self.assertTrue(any("blank data row" in f for f in hdr_findings))

            # Method catalog missing required column or empty pipe segment caught.
            bad_cat = root / "doc-templates" / "methods-bad.csv"
            bad_cat.write_text('category,name,key_questions\nsec,Foo,"Q1||Q2"\n', encoding="utf-8")
            self.assertTrue(
                any(
                    "empty question segment" in f
                    for f in validator.validate_csv_file(bad_cat, "doc-templates/methods-bad.csv")
                )
            )

            missing_col = root / "doc-templates" / "methods-missing.csv"
            missing_col.write_text("category,title\nsec,Foo\n", encoding="utf-8")
            self.assertTrue(
                any(
                    "missing required method catalog column" in f
                    for f in validator.validate_csv_file(missing_col, "doc-templates/methods-missing.csv")
                )
            )

            # Invalid UTF-8 rejected.
            bad_utf8 = root / "bad_utf8.csv"
            bad_utf8.write_bytes(b"\xff\xfe")
            self.assertTrue(any("invalid UTF-8" in f for f in validator.validate_csv_file(bad_utf8, "bad_utf8.csv")))

            # Strict CLI exits 1 on directory containing invalid CSVs.
            self.assertEqual(validator.main(["--root", str(root), "--strict"]), 1)


if __name__ == "__main__":
    unittest.main()
