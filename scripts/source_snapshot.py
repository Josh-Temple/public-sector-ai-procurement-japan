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
import subprocess
import sys
import time
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
    if not re.fullmatch(r"SRC-[A-Za-z0-9._-]+", source_id):
        raise ValueError("unsafe source ID")
    suffix = Path(original_filename or urllib.parse.urlparse(url).path).suffix[:12]
    if not re.fullmatch(r"\.[A-Za-z0-9]{1,10}", suffix or ""):
        suffix = ".bin"
    return f"{source_id}{suffix}"


def validate_url(url: str) -> None:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
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
        print(f"SNAPSHOT_DOWNLOAD source_id={source_id}", flush=True)
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = response.read()
        except urllib.error.HTTPError as error:
            # A missing or temporarily failing source must not block other eligible
            # Sources, and must never be promoted to a permanent registry state.
            print(
                f"::warning title=Source snapshot deferred::{source_id}: "
                f"HTTP {error.code}; remains snapshot_pending",
                flush=True,
            )
            continue
        except (urllib.error.URLError, TimeoutError):
            print(
                f"::warning title=Source snapshot deferred::{source_id}: "
                "network error; remains snapshot_pending",
                flush=True,
            )
            continue
        if not payload:
            raise RuntimeError(f"empty snapshot payload: {source_id}")

        if Path(asset_name).suffix.lower() == ".pdf" and not payload.startswith(b"%PDF-"):
            raise RuntimeError(f"snapshot is not a PDF payload: {source_id}")

        digest = hashlib.sha256(payload).hexdigest()
        # Immutable content-addressed assets preserve earlier versions on retries.
        asset_name = f"{Path(asset_name).stem}-{digest}{Path(asset_name).suffix}"
        path = out_dir / asset_name
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
    if locator_prefix != "github-draft-release:source-snapshots-private":
        raise ValueError("unsupported snapshot locator prefix")
    fieldnames, rows = read_rows()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    by_id = {item["source_id"]: item for item in manifest}
    if len(by_id) != len(manifest):
        raise ValueError("duplicate manifest source IDs")
    changed = 0

    for row in rows:
        item = by_id.get(row.get("source_id"))
        if not item:
            continue
        if row.get("url") != item.get("url") or row.get("access_state") != "accessible":
            raise RuntimeError("source eligibility changed after download")
        if not re.fullmatch(r"[a-f0-9]{64}", str(item.get("sha256", ""))):
            raise ValueError("invalid snapshot digest")
        expected = safe_asset_name(row["source_id"], row.get("original_filename", ""), row["url"])
        expected = f"{Path(expected).stem}-{item['sha256']}{Path(expected).suffix}"
        if item.get("asset_name") != expected or item.get("bytes", 0) <= 0:
            raise ValueError("invalid snapshot asset metadata")
        if (row.get("snapshot_status") == "snapshotted"
                and row.get("snapshot_hash") == f"sha256:{item['sha256']}"
                and row.get("snapshot_locator") == f"{locator_prefix}/{expected}"):
            changed += 1
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


def gh_json(*args: str) -> object:
    return json.loads(subprocess.check_output(["gh", *args], text=True))


def archive(manifest_path: Path, out_dir: Path) -> int:
    """Upload only to a verified draft; never overwrite an existing asset."""
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not manifest:
        print("SNAPSHOT_ARCHIVE_PASS assets=0")
        return 0
    tag = "source-snapshots-private"
    # List first: a read/network error must not be mistaken for release absence.
    repo = gh_json("repo", "view", "--json", "nameWithOwner")["nameWithOwner"]
    releases = gh_json("api", f"repos/{repo}/releases?per_page=100")
    matches = [r for r in releases if r["tag_name"] == tag]
    if not matches:
        if len(releases) == 100:
            raise RuntimeError("release pagination required before creating archive")
        subprocess.run(["gh", "release", "create", tag, "--draft", "--title",
                        "Source snapshots (draft; do not publish)", "--notes",
                        "Preservation only. Publishing requires a separate rights review."], check=True)
        # GitHub may briefly omit a newly created draft from list readback.
        # Retry reads only; never create another release after an ambiguous write.
        for attempt in range(5):
            created = gh_json("api", f"repos/{repo}/releases?per_page=100")
            created = [r for r in created if r["tag_name"] == tag]
            if created:
                break
            if attempt < 4:
                time.sleep(2 ** attempt)
        if len(created) != 1 or not created[0]["draft"]:
            raise RuntimeError("created draft archive could not be verified")
        release_id = created[0]["id"]
    else:
        release_id = matches[0]["id"]
    for item in manifest:
        release = gh_json("api", f"repos/{repo}/releases/{release_id}")
        if not release["draft"]:
            raise RuntimeError("snapshot archive is published; refusing upload")
        name = item["asset_name"]
        if Path(name).name != name or not re.fullmatch(r"SRC-[A-Za-z0-9._-]+", name):
            raise ValueError("unsafe manifest asset name")
        payload = (out_dir / name).read_bytes()
        if not payload or hashlib.sha256(payload).hexdigest() != item["sha256"]:
            raise RuntimeError("local snapshot hash mismatch")
        assets = gh_json("api", f"repos/{repo}/releases/{release_id}/assets?per_page=100")
        if len(assets) == 100:
            raise RuntimeError("asset pagination required")
        existing = [a for a in assets if a["name"] == name]
        if existing:
            # Verify bytes rather than trusting the asset filename or size alone.
            downloaded = subprocess.check_output(["gh", "api", "-H", "Accept: application/octet-stream",
                                                  f"repos/{repo}/releases/assets/{existing[0]['id']}"])
            if hashlib.sha256(downloaded).hexdigest() != item["sha256"]:
                raise RuntimeError("existing archive asset collision")
        else:
            subprocess.run(["gh", "release", "upload", tag, str(out_dir / name)], check=True)
            assets = gh_json("api", f"repos/{repo}/releases/{release_id}/assets?per_page=100")
            uploaded = [a for a in assets if a["name"] == name]
            if len(uploaded) != 1:
                raise RuntimeError("uploaded archive asset not found")
            downloaded = subprocess.check_output(["gh", "api", "-H", "Accept: application/octet-stream",
                                                  f"repos/{repo}/releases/assets/{uploaded[0]['id']}"])
            if hashlib.sha256(downloaded).hexdigest() != item["sha256"]:
                raise RuntimeError("uploaded archive asset hash mismatch")
        if not gh_json("api", f"repos/{repo}/releases/{release_id}")["draft"]:
            raise RuntimeError("archive draft state changed; refusing metadata promotion")
    print(f"SNAPSHOT_ARCHIVE_PASS assets={len(manifest)}")
    return 0


def verify() -> int:
    """Restore registered snapshots into memory, without upload or metadata edits."""
    _, rows = read_rows()
    rows = [row for row in rows if row.get("snapshot_status") == "snapshotted"]
    if not rows:
        print("SNAPSHOT_VERIFY_PASS assets=0")
        return 0
    # Validate every locator before accessing GitHub. Never follow stored URLs.
    prefix = "github-draft-release:source-snapshots-private/"
    for row in rows:
        digest = row.get("snapshot_hash", "")
        if not re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
            raise ValueError("invalid registered snapshot hash")
        locator = row.get("snapshot_locator", "")
        name = locator.removeprefix(prefix)
        if (not locator.startswith(prefix) or Path(name).name != name
                or not re.fullmatch(re.escape(row["source_id"]) + "-" + digest[7:]
                                    + r"\.[A-Za-z0-9]{1,10}", name)):
            raise ValueError("invalid registered snapshot locator")
    repo = gh_json("repo", "view", "--json", "nameWithOwner")["nameWithOwner"]
    releases = gh_json("api", f"repos/{repo}/releases?per_page=100")
    matches = [r for r in releases if r["tag_name"] == "source-snapshots-private"]
    if len(matches) != 1 or not matches[0]["draft"]:
        raise RuntimeError("registered snapshot archive is missing, ambiguous or published")
    release_id = matches[0]["id"]
    assets = gh_json("api", f"repos/{repo}/releases/{release_id}/assets?per_page=100")
    if len(assets) == 100:
        raise RuntimeError("asset pagination required")
    for row in rows:
        if not gh_json("api", f"repos/{repo}/releases/{release_id}")["draft"]:
            raise RuntimeError("archive draft state changed during restoration")
        name = row["snapshot_locator"][len(prefix):]
        matching = [a for a in assets if a["name"] == name]
        if len(matching) != 1:
            raise RuntimeError(f"registered snapshot asset missing or ambiguous: {row['source_id']}")
        payload = subprocess.check_output([
            "gh", "api", "-H", "Accept: application/octet-stream",
            f"repos/{repo}/releases/assets/{matching[0]['id']}",
        ])
        if not payload or hashlib.sha256(payload).hexdigest() != row["snapshot_hash"][7:]:
            raise RuntimeError(f"restored snapshot hash mismatch: {row['source_id']}")
        print(f"SNAPSHOT_RESTORE_PASS source={row['source_id']} bytes={len(payload)}")
    if not gh_json("api", f"repos/{repo}/releases/{release_id}")["draft"]:
        raise RuntimeError("archive draft state changed after restoration")
    print(f"SNAPSHOT_VERIFY_PASS assets={len(rows)}")
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

    p_archive = sub.add_parser("archive")
    p_archive.add_argument("--manifest", required=True, type=Path)
    p_archive.add_argument("--out-dir", required=True, type=Path)

    sub.add_parser("verify")

    args = parser.parse_args()
    if args.command == "verify":
        return verify()
    if args.command == "prepare":
        return prepare(args.out_dir, args.manifest)
    if args.command == "archive":
        return archive(args.manifest, args.out_dir)
    return apply(args.manifest, args.locator_prefix)


if __name__ == "__main__":
    sys.exit(main())
