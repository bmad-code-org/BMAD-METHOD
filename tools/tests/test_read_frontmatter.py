import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "read_frontmatter.py"


def test_prints_each_files_frontmatter_or_its_error(tmp_path):
    files = {
        "fields.md": "---\r\ntitle: 'Fix #42'\r\nsidebar:\r\n  order: 05\r\n---\r\nBody\r\n",
        "bare.md": "# No frontmatter\n",
        "open.md": "---\ntitle: x\n",
        "bad.md": "---\ntitle: x\nsidebar: [\n---\n",
    }
    for name, text in files.items():
        (tmp_path / name).write_bytes(text.encode())
    paths = [str(tmp_path / name) for name in files]
    result = subprocess.run(
        [sys.executable, "-B", str(SCRIPT)], input="\n".join(paths), capture_output=True, text=True, check=True
    )
    read = json.loads(result.stdout)
    assert read[paths[0]] == {"fields": {"title": "Fix #42", "sidebar": {"order": "05"}}}
    assert read[paths[1]] == {"fields": {}}
    assert read[paths[2]] == {"error": "frontmatter is not terminated"}
    assert read[paths[3]]["error"].startswith("line 4: ")
