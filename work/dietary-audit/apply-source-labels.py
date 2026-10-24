import copy
import json
import re
from pathlib import Path

# One-off edit: decode existing JSON rows and replace only their dietary array.
root = Path(__file__).resolve().parents[2]
audit = json.loads((root / 'docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json').read_text(encoding='utf-8'))
targets = {(r['id'], r['name'], r['city'], r['area']) for r in audit['source_records']}
found = set()
decoder = json.JSONDecoder()
for path in (root / 'src/models/venues').glob('*.js'):
    if path.name in ('metros.js', 'qualification.js', 'vadodara.js'):
        continue
    text = path.read_text(encoding='utf-8')
    start = text.index('[')
    before, end = decoder.raw_decode(text, start)
    edits = []
    pos = start + 1
    for record in before:
        pos = re.compile(r'[\s,]*').match(text, pos).end()
        parsed, stop = decoder.raw_decode(text, pos)
        assert parsed == record
        key = (record.get('id', record.get('external_place_id')), record['name'], record['city'], record.get('area'))
        if key in targets:
            found.add(key)
            field = 'dietary_options' if 'dietary_options' in record else 'dietaryOptions'
            old = record[field]
            assert 'pure_veg' not in old, key
            assert not any(re.sub('[^a-z]', '', v.lower()) in {'egg', 'eggs', 'eggetarian', 'nonveg', 'nonvegetarian', 'mixed', 'both'} for v in old), key
            raw = text[pos:stop]
            match = re.search(r'"' + field + r'"\s*:\s*', raw)
            array_start = pos + match.end()
            values, array_end = decoder.raw_decode(text, array_start)
            assert values == old
            value_text = text[array_start:array_end]
            if '\n' in value_text:
                indent = re.search(r'\n(\s*)"', value_text).group(1)
                close = value_text.rfind('\n')
                replacement = value_text[:close] + ',\n' + indent + '"pure_veg"' + value_text[close:]
            else:
                replacement = json.dumps(old + ['pure_veg'], ensure_ascii=False, separators=(',', ':'))
            edits.append((array_start, array_end, replacement))
        pos = stop
    if not edits:
        continue
    updated = text
    for a, b, replacement in reversed(edits):
        updated = updated[:a] + replacement + updated[b:]
    after, _ = decoder.raw_decode(updated, start)
    expected = copy.deepcopy(before)
    for record in expected:
        key = (record.get('id', record.get('external_place_id')), record['name'], record['city'], record.get('area'))
        if key in targets:
            record['dietary_options' if 'dietary_options' in record else 'dietaryOptions'].append('pure_veg')
    assert after == expected, path
    path.write_text(updated, encoding='utf-8', newline='')
    print(path.name, len(edits))
assert found == targets, targets - found
print('PASS: only verified dietary arrays changed; every target matched')
