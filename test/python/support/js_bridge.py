"""Python wrapper for black-box calling real JS production exports from pytest.

See test/README.md's "JavaScript Bridge Pattern" section for the supported
usage pattern. Pair this with test/python/support/js_bridge.js, the generic
Node runner this module shells out to.
"""

import json
import subprocess
from pathlib import Path

_BRIDGE_JS = Path(__file__).resolve().parent / "js_bridge.js"


_TIMEOUT_SECONDS = 30


def call(module_path: str, export: str, *args):
    """Call a real JS production export and return its JSON-decoded result.

    module_path: path to the JS module to require, relative to the repo root
        (matching the current working directory when pytest runs via
        `npm run test:python` or `pytest` from the repo root).
    export: bare export name (e.g. "extractCsvRefs"), which calls
        `require(module_path)[export](...args)`; or a dotted "Class.method"
        name (e.g. "CustomModuleManager.parseSource"), which calls
        `new require(module_path)[Class]()[method](...args)`.
    *args: JSON-serializable positional arguments to pass to the call.

    Raises RuntimeError with the subprocess's stderr if the bridge exits
    non-zero (e.g. an unknown export name) or does not finish within
    `_TIMEOUT_SECONDS`.
    """
    try:
        result = subprocess.run(
            ["node", str(_BRIDGE_JS), module_path, export, json.dumps(args)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"js_bridge call to {module_path}:{export} did not finish within "
            f"{_TIMEOUT_SECONDS}s"
        ) from exc

    if result.returncode != 0:
        raise RuntimeError(result.stderr)

    return json.loads(result.stdout)
