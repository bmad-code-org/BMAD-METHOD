"""aggregate_benchmark.py leaves incomplete runs out of the numbers."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from aggregate_benchmark import load_records, summarize_config  # noqa: E402


class AggregateTest(unittest.TestCase):
    def test_incomplete_runs_are_excluded_and_counted(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            rows = [
                ("a", {"status": "ok", "elapsed_s": 10.0}),
                ("b", {"status": "ok", "elapsed_s": 12.0}),
                ("c", {"status": "timeout", "elapsed_s": 600.0}),
                ("d", {"status": "harness-missing", "elapsed_s": 0.01}),
            ]
            for name, data in rows:
                (root / name).mkdir()
                (root / name / "timing.json").write_text(json.dumps(data))
            records, excluded = load_records(root)
            self.assertEqual(excluded, 2)
            self.assertEqual(summarize_config(records)["metrics"]["elapsed_s"]["mean"], 11.0)

    def test_records_without_status_count_as_complete(self):
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "runs.json"
            f.write_text(json.dumps({"runs": [{"elapsed_s": 1.0}, {"elapsed_s": 3.0}]}))
            records, excluded = load_records(f)
            self.assertEqual((len(records), excluded), (2, 0))


if __name__ == "__main__":
    unittest.main()
