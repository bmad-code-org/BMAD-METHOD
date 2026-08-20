#!/usr/bin/env python3
"""Web Bundle Release Packager

Zips each bundle under web-bundles/ into dist/web-bundles/{slug}.zip
for attachment to a GitHub Release.

Usage:
  python3 tools/bundle_web_bundles.py

After running, the script prints the exact `gh release create` command
(with the correct tag from bundles.json) for you to copy.
"""

from __future__ import annotations

import json
import os
import re
import sys
import zipfile

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUNDLES_DIR = os.path.join(REPO_ROOT, "web-bundles")
DIST_DIR = os.path.join(REPO_ROOT, "dist", "web-bundles")
MANIFEST = os.path.join(BUNDLES_DIR, "bundles.json")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def fail(msg: str) -> None:
    print(f"[ERROR] {msg}", file=sys.stderr)
    sys.exit(1)


def load_manifest() -> dict:
    if not os.path.exists(MANIFEST):
        fail(f"bundles.json not found at {MANIFEST}")

    with open(MANIFEST, encoding="utf-8") as f:
        raw = f.read()
    try:
        manifest = json.loads(raw)
    except json.JSONDecodeError as error:
        fail(f"bundles.json is not valid JSON: {error}")

    bundles = manifest.get("bundles")
    if not isinstance(bundles, list) or len(bundles) == 0:
        fail('bundles.json is missing a non-empty "bundles" array.')

    release_tag = manifest.get("releaseTag")
    if not isinstance(release_tag, str) or not release_tag:
        fail('bundles.json is missing "releaseTag".')

    return manifest


def zip_bundle(slug: str, out_path: str) -> None:
    if os.path.exists(out_path):
        os.unlink(out_path)

    src_dir = os.path.join(BUNDLES_DIR, slug)
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(src_dir):
            dirs.sort()
            for name in sorted(files):
                if name == ".DS_Store":
                    continue
                file_path = os.path.join(root, name)
                arcname = os.path.join(slug, os.path.relpath(file_path, src_dir))
                zf.write(file_path, arcname)


def main() -> None:
    manifest = load_manifest()
    release_tag = manifest["releaseTag"]

    os.makedirs(DIST_DIR, exist_ok=True)

    print(f"Packaging {len(manifest['bundles'])} bundles for release {release_tag}\n")

    zipped: list[str] = []
    missing: list[str] = []
    invalid: list[str] = []
    for bundle in manifest["bundles"]:
        slug = bundle.get("slug")
        if not slug or not SLUG_RE.match(slug):
            invalid.append(slug or "(no slug)")
            print(f"  [INVALID] slug must match {SLUG_RE.pattern} — got: {slug}", file=sys.stderr)
            continue

        src = os.path.join(BUNDLES_DIR, slug)
        if not os.path.exists(src):
            missing.append(slug)
            print(f"  [MISSING] {slug} — directory not found", file=sys.stderr)
            continue

        out = os.path.join(DIST_DIR, f"{slug}.zip")
        zip_bundle(slug, out)

        size = os.path.getsize(out) / 1024
        print(f"  [OK] {slug}.zip ({size:.1f} KB)")
        zipped.append(slug)

    if invalid:
        fail(f"Refusing to publish: {len(invalid)} bundle(s) have invalid slugs: {', '.join(invalid)}")
    if missing:
        fail(f"Refusing to publish an incomplete release: missing directories for {', '.join(missing)}")
    if not zipped:
        fail("No bundles were packaged. Check bundles.json against web-bundles/ subdirectories.")

    print(f"\nWrote {len(zipped)} bundles to {os.path.relpath(DIST_DIR, REPO_ROOT)}/")
    print("\nNext step — create or update the GitHub Release:\n")
    print(f"  gh release create {release_tag} dist/web-bundles/*.zip \\")
    print(f'    --title "{release_tag}" \\')
    print(
        '    --notes "BMad web bundles for Gemini Gems and ChatGPT Custom GPTs. '
        'See https://bmadcode.com/web-bundles/"\n'
    )
    print("Or, to refresh an existing release:\n")
    print(f"  gh release upload {release_tag} dist/web-bundles/*.zip --clobber\n")


if __name__ == "__main__":
    main()
