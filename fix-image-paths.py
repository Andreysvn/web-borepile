from pathlib import Path
import re

pattern_src_href = re.compile(r'(?P<prefix>(?:src|href)=\")(?P<path>imgs/[^\"\']*\s[^\"\']*)(?P<suffix>\")')
pattern_url = re.compile(r'(?P<prefix>url\([\"\']?)(?P<path>(?:\.\./)?imgs/[^\"\')]*\s[^\"\')]*)(?P<suffix>[\"\']?\))')

files = list(Path('.').rglob('*.html')) + list(Path('.').rglob('*.css'))
updated = 0
for file_path in files:
    text = file_path.read_text(encoding='utf-8')
    def repl(m):
        return m.group('prefix') + m.group('path').replace(' ', '%20') + m.group('suffix')
    new_text = pattern_src_href.sub(repl, text)
    new_text = pattern_url.sub(repl, new_text)
    if new_text != text:
        file_path.write_text(new_text, encoding='utf-8')
        updated += 1
        print(f'Updated {file_path}')
print(f'Total updated files: {updated}')
