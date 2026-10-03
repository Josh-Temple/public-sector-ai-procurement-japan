#!/usr/bin/env python3
"""Prepare and record private durable snapshots for selected public Sources.

Only rows explicitly marked snapshot_pending + accessible + URL are downloaded.
The intended storage target is a private GitHub draft-release asset; this script
never changes evidence meaning or promotes unavailable/not-public Sources.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "data" / "source_documents.csv"


def read_rows() -> tuple[list[str], list[dict[str, str]]]:
    with SOURCE_CSV.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        return list(reader.fieldnames or []), list(reader)


def safe_asset_name(source_id: str, original_filename: str, url: str) -> str:
    suffix = Path(original_filename or urllib.parse.urlparse(url).path).suffix[:12]
    if not re.fullmatch(r"\.[A-Za-z0-9]{1,10}", suffix or ""):
        suffix = ".bin"
    return f"{source_id}{suffix}"


def validate_url(url: str) -> None:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname:
        raise ValueError(f"snapshot URL must be HTTPS: {url}")
    host = parsed.hostname.lower()
    if host in {"localhost", "127.0.0.1", "::1"} or host.endswith(".local"):
        raise ValueError(f"local snapshot URL is not allowed: {url}")


def prepare(out_dir: Path, manifest_path: Path) -> int:
    _, rows = read_rows()
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, object]] = []

    for row in rows:
        if not (
            row.get("snapshot_status") == "snapshot_pending"
            and row.get("access_state") == "accessible"
            and row.get("url")
        ):
            continue

        source_id = row["source_id"]
        url = row["url"]
        validate_url(url)
        asset_name = safe_asset_name(source_id, row.get("original_filename", ""), url)
        path = out_dir / asset_name

        request = urllib.request.Request(
            url,
            headers={"User-Agent": "public-sector-ai-procurement-japan snapshot-preservation/1.0"},
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = response.read()
        if not payload:
            raise RuntimeError(f"empty snapshot payload: {source_id}")

        digest = hashlib.sha256(payload).hexdigest()
        path.write_bytes(payload)
        manifest.append({
            "source_id": source_id,
            "url": url,
            "asset_name": asset_name,
            "sha256": digest,
            "bytes": len(payload),
        })

    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"SNAPSHOT_PREPARE_PASS candidates={len(manifest)} manifest={manifest_path}")
    return 0


def apply(manifest_path: Path, locator_prefix: str) -> int:
    fieldnames, rows = read_rows()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    by_id = {item["source_id"]: item for item in manifest}
    changed = 0

    for row in rows:
        item = by_id.get(row.get("source_id"))
        if not item:
            continue
        if row.get("snapshot_status") != "snapshot_pending":
            raise RuntimeError(f"refusing to overwrite non-pending snapshot state: {row.get('source_id')}")
        row["snapshot_hash"] = f"sha256:{item['sha256']}"
        row["snapshot_status"] = "snapshotted"
        row["snapshot_locator"] = f"{locator_prefix.rstrip('/')}/{item['asset_name']}"
        changed += 1

    if changed != len(manifest):
        raise RuntimeError(f"manifest/source mismatch: applied={changed} manifest={len(manifest)}")

    with SOURCE_CSV.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"SNAPSHOT_APPLY_PASS changed={changed}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    p_prepare = sub.add_parser("prepare")
    p_prepare.add_argument("--out-dir", required=True, type=Path)
    p_prepare.add_argument("--manifest", required=True, type=Path)

    p_apply = sub.add_parser("apply")
    p_apply.add_argument("--manifest", required=True, type=Path)
    p_apply.add_argument("--locator-prefix", required=True)

    args = parser.parse_args()
    if args.command == "prepare":
        return prepare(args.out_dir, args.manifest)
    return apply(args.manifest, args.locator_prefix)


if __name__ == "__main__":
    sys.exit(main())
