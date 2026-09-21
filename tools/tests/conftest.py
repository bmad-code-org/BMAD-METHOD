import tempfile
from pathlib import Path

# Windows hands out the temp root as a short path (RUNNER~1). No test, output, or expected value
# should hold that form: every temp directory in the suite is created under the resolved root.
tempfile.tempdir = str(Path(tempfile.gettempdir()).resolve())
