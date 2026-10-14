#!/usr/bin/env python3
"""Local PR browser regression for Japanese procurement copy and unchanged filters."""
import argparse,csv,json,hashlib
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright

def main():
 p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:8765/');p.add_argument('--output-dir',default='procurement-copy-pr-qa');a=p.parse_args()
 assert a.url.startswith(('http://127.0.0.1:','http://localhost:'))
 dest=Path(a.output_dir);dest.mkdir(parents=True,exist_ok=True);base=a.url.rstrip('/')+'/';observations=[]
 def save(page,name):
  page.screenshot(path=str(dest/(name+'.png')),full_page=True)
  (dest/(name+'.html')).write_text(page.content())
  observations.append({'name':name,'url':page.url,'utc':datetime.now(timezone.utc).isoformat(),'text':page.locator('body').inner_text()})
 with sync_playwright() as engine:
  browser=engine.chromium.launch(headless=True,args=['--no-sandbox']);page=browser.new_page(viewport={'width':1280,'height':900},locale='ja-JP',accept_downloads=True)
  page.goto(base);page.locator('#requirement-rows tr').nth(134).wait_for()
  option_labels={o.get_attribute('value'):o.inner_text() for o in page.locator('#requirement-change option').all()}
  assert option_labels['threshold_defined']!=option_labels['quantified']
  with open('data/effective_requirements.csv') as f: canonical=list(csv.DictReader(f))
  for change,count in [('threshold_defined',2),('quantified',5)]:
   page.locator('#requirement-change').select_option(change)
   ids=page.locator('#requirement-rows tr').evaluate_all('(els)=>els.map(e=>e.dataset.effectiveId)')
   assert len(ids)==count
   assert set(ids)=={r['effective_requirement_id'] for r in canonical if r['change_type']==change}
   assert page.locator('#requirement-rows').inner_text().count(option_labels[change])==count
   assert 'change='+change in page.url
   url=page.url;save(page,change)
   page.reload();page.locator('#requirement-rows tr').nth(count-1).wait_for()
   assert page.locator('#requirement-change').input_value()==change
   assert set(page.locator('#requirement-rows tr').evaluate_all('(els)=>els.map(e=>e.dataset.effectiveId)'))==set(ids)
  page.locator('#requirement-change').select_option('threshold_relaxed');page.locator('#requirement-query').fill('テンプレート');page.locator('#requirement-amended').select_option('qa')
  row=page.locator('#requirement-rows tr');assert row.count()==1
  assert row.get_attribute('data-effective-id')=='EFF-oumi-template-count'
  text=row.inner_text();assert '>=200' in text and '>=50' in text
  assert 'SRC-oumi-2026-spec' in text and '7(4)ユーザー機能 コ' in text
  assert 'SRC-oumi-2026-qa' in text and 'Q&A No.8' in text
  links=row.locator('a[data-source-role]').evaluate_all('(els)=>els.map(e=>({role:e.dataset.sourceRole,id:e.dataset.sourceId,href:e.href}))')
  assert any(x['id']=='SRC-oumi-2026-spec' and x['href'].startswith('https://www.city.omihachiman.lg.jp/') for x in links),links
  assert any('AI_kaitou.pdf' in x['href'] for x in links)
  save(page,'m07_m08_compound');url=page.url;page.reload();row=page.locator('#requirement-rows tr');row.wait_for();assert row.count()==1
  page.locator('#requirement-query').fill('存在しない条件xyz');assert page.locator('#requirement-rows tr').count()==0;assert page.locator('#requirement-empty').is_visible();save(page,'zero')
  page.locator('#reset-requirement').click();assert page.locator('#requirement-rows tr').count()==135
  assert page.evaluate('document.activeElement.id')=='requirement-query';save(page,'reset_focus')
  cases=['oumi-2026-joint-genai','matsue-2026-genai-support','gosen-2026-genai-service']
  for i,case in enumerate(cases):
   page.locator('#case-rows tr').filter(has=page.locator(f'a[href*="case={case}"]')).locator('input.compare-check').check()
   if i>0: save(page,'compare_'+str(i+1))
  text=page.locator('#compare-table').inner_text()
  for expected in ['協議会会長（近江八幡市長）との基本契約','参加自治体ごとにサービス利用契約','第1優先交渉権者との契約協議を予定','単独団体による契約を想定']: assert expected in text
  for raw in ['council basic contract','negotiation_with_first_priority_negotiator','single_entity_contract']:assert raw not in text
  page.goto(base+'evaluation.html?topic=usage-pricing&case=oumi-2026-joint-genai');page.locator('#evaluation-case-detail').get_by_text('価格条件：',exact=False).wait_for()
  price=page.locator('#evaluation-case-detail').get_by_text('価格条件：',exact=False).inner_text();assert '基本契約で提案プランの利用金額等を定め、実際のサービス利用契約（利用申込み）は自治体ごとに締結する想定' in price;assert 'common plan/pricing' not in price;save(page,'evaluation_oumi')
  with page.expect_download() as info:page.locator('#evaluation-memo-download').click()
  target=dest/'oumi-evaluation.md';info.value.save_as(str(target));memo=target.read_text();assert price.removeprefix('価格条件：') in memo;assert '基本契約で提案プランの利用金額等を定め、実際のサービス利用契約（利用申込み）は自治体ごとに締結する想定' in memo
  # Inject unknown future values in the presentation inputs only; never edit canonical data.
  original=Path('data/procurement_structure.csv').read_text()
  page.route('**/data/procurement_structure.csv',lambda route:route.fulfill(status=200,content_type='text/csv',body=original.replace('common plan/pricing set by basic contract; actual service application per municipality','<img src=x onerror=alert(1)>')))
  page.reload();unknown=page.locator('#evaluation-case-detail').get_by_text('価格条件：',exact=False);unknown.wait_for();assert '日本語表示未対応（登録値）：<img' in unknown.inner_text();assert page.locator('#evaluation-case-detail img').count()==0;save(page,'unknown_safe')
  with page.expect_download() as info:page.locator('#evaluation-memo-download').click()
  target=dest/'unknown-evaluation.md';info.value.save_as(str(target));assert '&lt;img' in target.read_text() and '<img' not in target.read_text()
  browser.close()
 (dest/'observations.json').write_text(json.dumps({'browser':'Chromium','scope':'localhost PR build; not production/device/native zoom/AT/non-author acceptance','status':'PASS','m07_links':links,'observations':observations},ensure_ascii=False,indent=2))
 print('P2 copy/filter browser regression PASS')
if __name__=='__main__':main()
