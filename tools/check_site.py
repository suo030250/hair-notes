from pathlib import Path
import json, re
from datetime import date
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
CATEGORIES = {'hair-care', 'color-perm', 'styling', 'faq'}
STATUSES = {'seed', 'draft', 'reviewed', 'needs-review'}
errors = []

def check(condition, message):
    if not condition:
        errors.append(message)

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        for key in ('href', 'src'):
            if values.get(key):
                self.links.append(values[key])

articles = json.loads((DOCS / 'data/articles.json').read_text(encoding='utf-8-sig'))
check(isinstance(articles, list) and bool(articles), 'Articles must be a nonempty array')
ids = set()
for article in articles:
    name = article.get('id', '<missing>')
    check(bool(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name)), f'Invalid ID: {name}')
    check(name not in ids, f'Duplicate ID: {name}')
    ids.add(name)
    for field in ('title', 'summary', 'wikiPath'):
        check(isinstance(article.get(field), str) and bool(article[field].strip()), f'{name}: missing {field}')
    check(article.get('category') in CATEGORIES, f'{name}: invalid category')
    check(article.get('status') in STATUSES, f'{name}: invalid status')
    check(40 <= len(article.get('summary', '')) <= 100, f'{name}: summary must contain 40-100 characters')
    for field in ('created', 'updated'):
        try:
            date.fromisoformat(article[field])
        except (KeyError, TypeError, ValueError):
            errors.append(f'{name}: invalid {field}')
    check(isinstance(article.get('tags'), list) and all(isinstance(x,str) for x in article['tags']), f'{name}: invalid tags')
    wiki = (ROOT / article.get('wikiPath', '')).resolve()
    check((wiki.is_relative_to(ROOT / 'wiki') or wiki.is_relative_to(ROOT / 'projects')) and wiki.is_file(), f'{name}: Wiki source not found')
    sources = article.get('sources', [])
    check(bool(sources), f'{name}: customer article needs sources')
    for source in sources:
        check(bool(source.get('title')), f'{name}: missing source title')
        parsed = urlsplit(source.get('url', ''))
        check(parsed.scheme == 'https' and bool(parsed.netloc), f'{name}: invalid source URL')
        try:
            date.fromisoformat(source['accessed'])
        except (KeyError, TypeError, ValueError):
            errors.append(f'{name}: invalid source access date')
    check(bool(article.get('sections')), f'{name}: no sections')
    for section in article.get('sections', []):
        check(bool(section.get('heading')), f'{name}: section needs heading')
        check(isinstance(section.get('paragraphs'),list) and bool(section['paragraphs']), f'{name}: section needs paragraphs')
        for paragraph in section.get('paragraphs', []):
            check(isinstance(paragraph,str), f'{name}: paragraph must be text')
            for citation in re.findall(r'\[(\d+)\]',paragraph):
                check(1 <= int(citation) <= len(sources), f'{name}: undefined citation {citation}')
    check(bool(article.get('limitations')), f'{name}: missing limitations')

pages = {}
for path in DOCS.rglob('*.html'):
    page = Page()
    page.feed(path.read_text(encoding='utf-8-sig'))
    pages[path.resolve()] = page
    check(len(page.ids) == len(set(page.ids)), f'{path.name}: duplicate HTML IDs')
for path, page in pages.items():
    for link in page.links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc:
            continue
        check(not parts.path.startswith('/'), f'{path.name}: root path breaks project Pages: {link}')
        dest = (path.parent / unquote(parts.path)).resolve() if parts.path else path
        check(dest.is_relative_to(DOCS), f'{path.name}: link escapes public docs: {link}')
        check(dest.exists(), f'{path.name}: broken link {link}')
        if parts.fragment and dest in pages:
            check(parts.fragment in pages[dest].ids, f'{path.name}: missing anchor {link}')
for asset in DOCS.rglob('*'):
    if asset.is_file():
        check(asset.suffix.lower() not in ('.pdf', '.env', '.txt'), f'Unexpected private source in public docs: {asset.name}')
if errors:
    for error in errors:
        print('FAIL:',error)
    raise SystemExit(1)
print(f'PASS: {len(articles)} articles, {len(pages)} HTML pages, IDs, fields, citations, Wiki mapping, local assets and relative paths.')

