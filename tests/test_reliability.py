"""Failure-path checks use isolated copies; canonical data never changes."""
import contextlib
import csv
import hashlib
import importlib.util
import io
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]

def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / f'{name}.py')
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj

class IntegrityTests(unittest.TestCase):
    def test_corruptions_fail(self):
        changes = [
            ('cases.csv', lambda rows: rows.append(dict(rows[0]))),
            ('vendor_scores.csv', lambda rows: rows.append(dict(rows[0]))),
            ('bid_results.csv', lambda rows: rows.append(dict(rows[0]))),
            ('joint_procurement_entities.csv', lambda rows: rows.append(dict(rows[0]))),
            ('specialized_requirements.csv', lambda rows: rows[0].update(case_id='')),
            ('effective_requirements.csv', lambda rows: rows[0].update(changed_by_source_id='SRC-saitama-2026-ai-support-qa', change_locator='')),
            ('source_documents.csv', lambda rows: rows[0].update(access_state='not_public')),
            ('source_documents.csv', lambda rows: rows[0].update(snapshot_status='snapshotted', snapshot_hash='sha256:'+'a'*64, snapshot_locator='github-draft-release:source-snapshots-private/SRC-wrong-'+'b'*64+'.pdf')),
            ('requirements.csv', lambda rows: rows[0].update(case_id='missing-case')),
            ('review_coverage.csv', lambda rows: rows[0].update(source_id='SRC-missing')),
            ('review_coverage.csv', lambda rows: rows[0].update(review_state='invented')),
            ('case_stage.csv', lambda rows: rows[0].update(last_verified='2026-02-30')),
            ('source_documents.csv', lambda rows: rows[0].update(snapshot_status='snapshotted', snapshot_hash='', snapshot_locator='')),
            ('source_documents.csv', lambda rows: rows[0].update(snapshot_status='snapshot_pending', access_state='not_public')),
            ('source_documents.csv', lambda rows: rows[0].update(snapshot_locator='https://example.org/?token=secret')),
            ('evidence_coverage.csv', lambda rows: rows.pop()),
        ]
        for name, mutate in changes:
            with self.subTest(name=name, mutation=mutate), tempfile.TemporaryDirectory() as td:
                root = Path(td)
                for folder in ['data', 'claims', 'sources']:
                    shutil.copytree(ROOT / folder, root / folder)
                path = root / 'data' / name
                with path.open() as fh:
                    reader = csv.DictReader(fh); fields = reader.fieldnames; rows = list(reader)
                mutate(rows)
                with path.open('w') as fh:
                    writer = csv.DictWriter(fh, fields); writer.writeheader(); writer.writerows(rows)
                v = module('validate_repository'); v.ROOT = root; v.DATA = root / 'data'
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(v.main(), 1)

    def test_malformed_csv_fails_without_crashing(self):
        for broken in ['case_id,case_id\nx,y\n', 'case_id,government_name,procurement_title,category\nx,y\n', 'case_id,government_name,procurement_title,category\nx,y,z,a,extra\n']:
            with self.subTest(csv=broken), tempfile.TemporaryDirectory() as td:
                root = Path(td)
                for folder in ['data', 'claims', 'sources']:
                    shutil.copytree(ROOT / folder, root / folder)
                (root / 'data' / 'cases.csv').write_text(broken)
                v = module('validate_repository'); v.ROOT = root; v.DATA = root / 'data'
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(v.main(), 1)

    def test_claim_and_source_note_failures(self):
        v = module('validate_repository')
        with tempfile.TemporaryDirectory() as td:
            v.ROOT = Path(td); (v.ROOT / 'claims').mkdir(); (v.ROOT / 'sources').mkdir()
            (v.ROOT / 'claims' / 'CLM-test.md').write_text('---\nid: CLM-test\nstatus: reviewed\nlast_verified: 2026-02-30\nevidence:\n  - source: SRC-test\n    locator: ""\n---\n')
            (v.ROOT / 'sources' / 'wrong.md').write_text('---\nid: SRC-test\n---\n')
            errors = []; v.validate_claims({'SRC-test'}, errors); v.validate_source_notes({'SRC-test'}, errors)
            self.assertTrue(any('last_verified' in e for e in errors))
            self.assertTrue(any('empty locator' in e for e in errors))
            self.assertTrue(any('filename/id mismatch' in e for e in errors))

class SnapshotTests(unittest.TestCase):
    def setUp(self):
        self.s = module('source_snapshot')
        self.tmp = tempfile.TemporaryDirectory(); self.root = Path(self.tmp.name)
        self.s.SOURCE_CSV = self.root / 'sources.csv'
        self.fields = ['source_id','url','original_filename','access_state','snapshot_status','snapshot_hash','snapshot_locator']
        self.row = dict(zip(self.fields, ['SRC-test','https://example.go.jp/test.pdf','test.pdf','accessible','snapshot_pending','','']))
        self.write([self.row])
    def tearDown(self): self.tmp.cleanup()
    def write(self, rows):
        with self.s.SOURCE_CSV.open('w') as fh:
            w=csv.DictWriter(fh,self.fields); w.writeheader(); w.writerows(rows)
    def prepare(self): return self.s.prepare(self.root / 'assets', self.root / 'manifest.json')
    def test_zero_and_ineligible(self):
        for state in ['source_unavailable','not_public']:
            self.write([dict(self.row, access_state=state)])
            with patch.object(self.s.urllib.request,'urlopen') as fetch:
                self.assertEqual(self.prepare(),0); fetch.assert_not_called()
        (self.root / 'manifest.json').write_text('[]')
        with patch.object(self.s,'gh_json') as gh:
            self.s.archive(self.root / 'manifest.json', self.root / 'assets'); gh.assert_not_called()
    def test_404_and_empty_do_not_promote(self):
        before=self.s.SOURCE_CSV.read_bytes()
        for error in [HTTPError(self.row['url'],404,'missing',None,None), None]:
            with patch.object(self.s.urllib.request,'urlopen') as fetch:
                if error: fetch.side_effect=error
                else: fetch.return_value.__enter__.return_value.read.return_value=b''
                with self.assertRaises((HTTPError,RuntimeError)): self.prepare()
            self.assertEqual(self.s.SOURCE_CSV.read_bytes(),before)
            self.assertEqual(list((self.root / 'assets').iterdir()),[])
    def test_html_error_page_is_not_preserved_as_pdf(self):
        before = self.s.SOURCE_CSV.read_bytes()
        with patch.object(self.s.urllib.request, 'urlopen') as fetch:
            fetch.return_value.__enter__.return_value.read.return_value = b'<html>Access denied</html>'
            with self.assertRaisesRegex(RuntimeError, 'not a PDF'):
                self.prepare()
        self.assertEqual(self.s.SOURCE_CSV.read_bytes(), before)
        self.assertEqual(list((self.root / 'assets').iterdir()), [])

    def test_hash_apply_retry_and_stale_source(self):
        with patch.object(self.s.urllib.request,'urlopen') as fetch:
            fetch.return_value.__enter__.return_value.read.return_value=b'%PDF-1.7 fixture PDF'
            self.prepare()
        manifest=self.root / 'manifest.json'; item=json.loads(manifest.read_text())[0]
        self.assertEqual(item['sha256'],hashlib.sha256(b'%PDF-1.7 fixture PDF').hexdigest())
        self.assertIn(item['sha256'],item['asset_name'])
        prefix='github-draft-release:source-snapshots-private'
        self.s.apply(manifest,prefix); once=self.s.SOURCE_CSV.read_bytes()
        self.s.apply(manifest,prefix); self.assertEqual(once,self.s.SOURCE_CSV.read_bytes())
        self.write([dict(self.row,url='https://example.go.jp/changed.pdf')])
        with self.assertRaises(RuntimeError): self.s.apply(manifest,prefix)
    def test_restore_registered_snapshots_and_failures(self):
        payload = b'%PDF-1.7 restored fixture'
        digest = hashlib.sha256(payload).hexdigest()
        name = f'SRC-test-{digest}.pdf'
        saved = dict(self.row, snapshot_status='snapshotted', snapshot_hash='sha256:'+digest,
                     snapshot_locator='github-draft-release:source-snapshots-private/'+name)
        self.write([saved]); before = self.s.SOURCE_CSV.read_bytes()
        for failure in ['none', 'published', 'missing', 'collision', 'empty', 'state_change']:
            with self.subTest(failure=failure):
                answers = [{'nameWithOwner':'owner/repo'},
                           [{'tag_name':'source-snapshots-private','id':1,'draft':failure!='published'}]]
                if failure != 'published':
                    answers += [[] if failure=='missing' else [{'name':name,'id':2}]]
                    answers += [{'draft':failure!='state_change'}]
                    if failure=='none': answers += [{'draft':True}]
                data = b'wrong' if failure=='collision' else b'' if failure=='empty' else payload
                with patch.object(self.s,'gh_json',side_effect=answers), \
                     patch.object(self.s.subprocess,'check_output',return_value=data), \
                     patch.object(self.s.subprocess,'run') as mutate, \
                     patch.object(self.s.urllib.request,'urlopen') as official:
                    if failure=='none': self.assertEqual(self.s.verify(),0)
                    else:
                        with self.assertRaises(RuntimeError): self.s.verify()
                    mutate.assert_not_called(); official.assert_not_called()
                self.assertEqual(self.s.SOURCE_CSV.read_bytes(),before)
        self.write([dict(saved,snapshot_locator='https://example.org/?token=secret')])
        with patch.object(self.s,'gh_json') as gh:
            with self.assertRaises(ValueError): self.s.verify()
            gh.assert_not_called()
        self.write([self.row])
        with patch.object(self.s,'gh_json') as gh:
            self.assertEqual(self.s.verify(),0); gh.assert_not_called()

    def test_unsafe_names(self):
        with self.assertRaises(ValueError): self.s.safe_asset_name('../escape','x.pdf',self.row['url'])
    def test_published_archive_and_collision_refused(self):
        payload=b'fixture'; digest=hashlib.sha256(payload).hexdigest(); name=f'SRC-test-{digest}.pdf'
        assets=self.root / 'assets'; assets.mkdir(); (assets/name).write_bytes(payload)
        manifest=self.root/'manifest.json'; manifest.write_text(json.dumps([{'asset_name':name,'sha256':digest}]))
        for draft in [False,True]:
            answers=[{'nameWithOwner':'owner/repo'},[{'tag_name':'source-snapshots-private','id':1}],{'draft':draft}]
            if draft: answers.append([{'name':name,'id':2}])
            with patch.object(self.s,'gh_json',side_effect=answers), patch.object(self.s.subprocess,'check_output',return_value=b'wrong'), patch.object(self.s.subprocess,'run') as upload:
                with self.assertRaises(RuntimeError): self.s.archive(manifest,assets)
                upload.assert_not_called()

if __name__=='__main__': unittest.main()
